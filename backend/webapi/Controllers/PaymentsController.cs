using AutoMapper;
using chiffon_back.Code;
using chiffon_back.Context;
using chiffon_back.Models;
using DocumentFormat.OpenXml.EMMA;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http.HttpResults;


//using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Reflection.PortableExecutable;
using System.Security.Cryptography;
using System.Text;
using System.Web;
//using System.Web.Http;
using System.Web.Http.Cors; // пространство имен CORS

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors(origins: "http://185.40.31.18:3000,http://185.40.31.18:3010", headers: "*", methods: "*")]

    public class PaymentsController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.Payment, Context.Payment>();
                cfg.CreateMap<Context.Payment, Models.Payment>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private IConfiguration _configuration;

        private readonly ILogger<PaymentsController> _logger;

        private readonly IWebHostEnvironment _webHostEnvironment;

        public PaymentsController(ILogger<PaymentsController> logger, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _logger = logger;
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("Payment")]
        public Models.Payment Payment([FromQuery] string id)
        {
            try
            {
                Models.Payment o = config.CreateMapper().Map<Models.Payment>(ctx.Payments.FirstOrDefault(x => x.Id.ToString() == id));
                return o;
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} PaymentsController/Payment: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} PaymentsController/Payment: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
            }
            return new Models.Payment();
        }

        [HttpGet("OrderPayments")]
        public OrderPayments GetOrderPayments([FromQuery] string id)
        {
            OrderPayments payments = new Models.OrderPayments();
            payments.Items = ctx.Payments
                .Where(x => x.OrderId == Convert.ToInt32(id))
                .Select(x => config.CreateMapper().Map<Models.Payment>(x)).ToArray();

            foreach(Models.Payment p in payments.Items)
            {
                p.Currency = ctx.Currencies.FirstOrDefault(c => c.Id == p.CurrencyId).ShortName;
            }

            payments.Total = payments.Items.Sum(x => x.Amount);

            return payments;
        }

        [HttpGet("Payments")]
        public IEnumerable<Models.Payment> Get(int Id)
        {
            var payments = ctx.Payments
                .Where(x => x.OrderId == Id)
                .Select(x => config.CreateMapper().Map<Models.Payment>(x)).ToList();

            return payments;
        }
        
        [HttpPost("Pay")]
        public ActionResult<Models.Payment> Pay([FromBody]Models.Payment payment)
        {
            try
            {
                string? frontendUrl = _configuration.GetValue<string>("Url:ClientFrontend");
                string? vendorUrl = _configuration.GetValue<string>("Url:Frontend");
                string? ordersManager = _configuration.GetValue<string>("Orders:Manager");

                if (payment.Date == null) { payment.Date = DateTime.Now; }

                Context.Currency currency = ctx.Currencies.FirstOrDefault(x => x.Id == payment.CurrencyId);

                Context.Payment newPay = config.CreateMapper().Map<Context.Payment>(payment);
                decimal course = 1m;
                if (newPay.CurrencyId == 2) // "RUR"
                {
                    course = Helper.GetCurrencyCourse("USD", payment.Date);
                    if (course < 0)
                    {
                        course = currency.Rate.Value;
                    }
                }
                if (course > 1e-4m)
                {
                    newPay.Amount = Math.Round(newPay.CurrencyAmount / course, 2);
                }
                newPay.ExchangeRate = course;
                ctx.Payments.Add(newPay);
                ctx.SaveChanges();

                string clientName = "";
                string clientEmail = ""; //todo - from payment!
                string number = "";

                var order = ctx.Orders.FirstOrDefault(x => x.Id == payment.OrderId);
                if (order != null)
                {
                    clientName = order.ClientName;
                    clientEmail = order.ClientEmail;
                    number = order.Number.ToString();
                }

                string header = "'font-weight: #400; color: #66f;'";
                string headerBlack = "'font-weight: bold; color: #000;'";

                //------------------------------mail
                using (MailMessage mess = new MailMessage())
                {
                    string body = $"<p style={header}>Dear {clientName}!</p><p style={header}>You have successfully paid a order with number " + number + "</p>";
                    body += $"<p>Payment summ is {newPay.CurrencyAmount} {currency.ShortName}</p>";
                    body += $"<p>Your order link <a href='{frontendUrl}/order?uuid={order.Uuid}'>here</a> </p>";
                    body += $"<p style={header}>Best regards, textile company Angelika</p>";
                    body += $"<p style={headerBlack}>Our contacts:</p>";
                    body += "<p>Showroom address:<br/>Yaroslavskoe shosse, possession 1 building 1, Mytishchi, Moscow region, Russia.<br/>Postal code: 141009<br/>Phones: +7(926)018-01-25, +7(916)876-20-08";
                    body += "<p>Headquarters:<br/>Bolshaya Gruzinskaya, 20, 3A/P Moscow, Russia.<br/>Postal code: 123242</p>";

                    AlternateView AV = AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html);

                    SmtpClient client = new SmtpClient("smtp.mail.ru", Convert.ToInt32(587))
                    {
                        Credentials = new NetworkCredential("elizarov.sa@mail.ru", "5nwKmZ2SpintVmFRQVZV"), //"KZswYNWrd9eY1xVfvkre"),
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        Timeout = 5000
                    };
                    
                    mess.From = new MailAddress("elizarov.sa@mail.ru");
                    mess.To.Add(new MailAddress(clientEmail));
                    //mess.To.Add(new MailAddress(ordersManager));
                    mess.Subject = "A new payment has been made in the company Angelika";
                    mess.SubjectEncoding = Encoding.UTF8;
                    mess.Body = body;
                    mess.AlternateViews.Add(AV);
                    mess.IsBodyHtml = true;
                    /*try
                    {
                        mess.Attachments.Add(new Attachment(какой файл добавлять для отправки));
                    }
                    catch { }*/
                    client.Send(mess);
                    mess.Dispose();
                    client.Dispose();
                    Console.WriteLine("New order created and email was sended");
                }
                //------------------------------

                Helper.SendMessage(order.ClientEmail,
                    order.ClientName,
                    $"The contents of your order number {order.Number} dated {order.Created} have been confirmed by the supplier. To further complete your order, you must make payment; to do this, please follow the link below.",
                    $"{frontendUrl}/order?uuid={order.Uuid}",
                    $"Changes to your order number {order.Number}");


                List<string[]> vendors = new List<string[]>();
                foreach(var oi in ctx.OrderItems.Where(x => x.OrderId == payment.OrderId).ToList())
                {
                    var prod = ctx.Products.FirstOrDefault(x=>x.Id == oi.ProductId);
                    var vend = ctx.Vendors.FirstOrDefault(x => x.Id == prod.VendorId);
                    if (vendors.FirstOrDefault(x => x[0] == vend.Email) == null)
                    {
                        vendors.Add(new string[] { vend.Email, vend.VendorName });
                    }
                }

                foreach (var v in vendors)
                {
                    Helper.SendMessage(v[0], v[1], "Your goods ordered by the company Angelika have been paid for.", $"{vendorUrl}/listorderv", "Your goods ordered by the company Angelika have been paid for.");
                }

                
                return CreatedAtAction(nameof(Get), new { id = newPay.Id }, newPay);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }


    }
}

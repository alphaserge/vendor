using chiffon_back.Code;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Vml;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace chiffon_back.Models
{
    public class InvoiceItem
    {
        public int? Id { get; set; }
        public int? Quantity { get; set; }
        public string? ItemName { get; set; }
        public string? Unit { get; set; }
        public int? DiscountedRate { get; set; }
        public decimal? Price { get; set; }
         
    }
    public class Invoice
    {
        public int? Id { get; set; }
        public int? Number { get; set; }
        public string? Email { get; set; }
        public string? Phones { get; set; }
        public string? Supplier { get; set; }
        public string? SupplierFirmAccount { get; set; }
        public string? SupplierBankName { get; set; }
        public string? SupplierBankBIC { get; set; }
        public string? SupplierCorrAccount { get; set; }
        public string? SupplierINN { get; set; }
        public string? SupplierKPP { get; set; }
        public string? SupplierDetails { get; set; }
        public DateTime? Date { get; set; }
        public string? Customer { get; set; }
        public string? Currency { get; set; }
        public InvoiceItem[]? Items { get; set; }
    }

    public class InvoiceReports
    {
        public InvoiceReports()
        {
            //
            // TODO: добавьте логику конструктора
            //
        }


        public string CreateInvoice(Invoice inv, string path, string fileName, string language)
        {
            decimal courseUSD = Helper.GetCurrencyCourse("USD", DateTime.Now);

            OXML.OXSimpleWORD report = new OXML.OXSimpleWORD();
            
            inv.Supplier = "ООО \"Текстильная компания Анжелика\"\"";

            inv.SupplierFirmAccount = "40702810500000000066";
            inv.SupplierBankName = "\"КОММЕРЧЕСКИЙ ИНДО БАНК\" ООО Г.МОСКВА";
            inv.SupplierBankBIC = "044525500";
            inv.SupplierCorrAccount = "30101810400000000500";
            inv.SupplierINN = "7706270562";
            inv.SupplierKPP = "770601001";
            inv.SupplierDetails = "Общество с ограниченной ответственностью \"Текстильная компания \"АНЖЕЛИКА\", ИНН, 7706270562, КПП, 770601001, 119049,город Москва, улица Донская, дом 4, строение 2, 8 495 969 24 38";
            inv.Date = DateTime.Now;
            inv.Customer = "FIO";
            inv.Currency = "RUR";

            report.SetParagraph(OXML.Aligment.CENTER, OXML.Interval.INT_POINT_10pt, 0);

            if (language == "English")
                report.AddText("Attention! Payment of accounts means you agree to the terms of delivery. AOC necessarily, otherwise can not be guaranteed availability of goods in stock. The product is released by self after receipt of funds on the account of the Supplier (need the power of attorney and passport)", false, true, 14);
            else
                report.AddText("Внимание! Оплата данного счета означает согласие с условиями поставки товара. Уведомление об оплате обязательно, в противном случае не гарантируется наличие товара на складе. Товар отпускается самовывозом после поступления денежных средств на расчетный счет Поставщика (потребуются доверенность и паспорт)", false, true, 14);


            report.SetParagraph(OXML.Aligment.CENTER, OXML.Interval.INT_POINT_12pt, 0);
            report.AddText("");
            report.SetParagraph(OXML.Aligment.CENTER, OXML.Interval.INT_1, 0);

            if (language == "English")
                report.AddText("Attention! The account is valid for 5 business days", true, true, 26);
            else
                report.AddText("Внимание! Счет действителен в течение 5 банковских дней", true, true, 26);


            report.SetParagraph(OXML.Aligment.CENTER, OXML.Interval.INT_POINT_12pt, 0);
            //report.AddText("___________________________________________________________");
            report.AddText("");


            OXSimpleWordTable oxTable = new OXSimpleWordTable();
            oxTable.Border = 1;
            OXSimpleWordTableRow oxRow = new OXSimpleWordTableRow();
            oxRow.Cells.Add(new OXSimpleWordTableCell(inv.SupplierBankName, "5500", JustificationValues.Left, "20", "280", 2, OXSimpleWordTableCellVerticalMerge.None, OXSimpleWordTableCellBorders.NoBottom));
            oxRow.Cells.Add(new OXSimpleWordTableCell(language == "English" ? "BIC" : "БИК", "1000", JustificationValues.Left, "20", "280"));
            oxRow.Cells.Add(new OXSimpleWordTableCell(inv.SupplierBankBIC, "3200", JustificationValues.Left, "20", "280", 0, OXSimpleWordTableCellVerticalMerge.None, OXSimpleWordTableCellBorders.NoBottom));
            oxTable.Rows.Add(oxRow);
            oxRow = new OXSimpleWordTableRow();
            oxRow.Cells.Add(new OXSimpleWordTableCell(language == "English" ? "Beneficiary Bank" : "&Банк получателя", "5500", JustificationValues.Left, "20", "280", 2, OXSimpleWordTableCellVerticalMerge.None, OXSimpleWordTableCellBorders.NoTop));
            oxRow.Cells.Add(new OXSimpleWordTableCell(language == "English" ? "Acc.No&" : "Сч. №&", "1000", JustificationValues.Left, "20", "280"));
            oxRow.Cells.Add(new OXSimpleWordTableCell(inv.SupplierCorrAccount, "3200", JustificationValues.Left, "20", "280", 0, OXSimpleWordTableCellVerticalMerge.None, OXSimpleWordTableCellBorders.NoTop));
            //OXSimpleWordTableColumnOptions oxColOpts = new OXSimpleWordTableColumnOptions();
            oxTable.Rows.Add(oxRow);
            oxRow = new OXSimpleWordTableRow();
            oxRow.Cells.Add(new OXSimpleWordTableCell(string.Format(language == "English" ? "INT" : "ИНН {0}", inv.SupplierINN), "2800", JustificationValues.Left, "20", "280"));
            oxRow.Cells.Add(new OXSimpleWordTableCell(string.Format(language == "English" ? "RCR" : "КПП {0}", inv.SupplierKPP), "2700", JustificationValues.Left, "20", "280"));
            oxRow.Cells.Add(new OXSimpleWordTableCell(language == "English" ? "Acc.No" : "Сч. №", "1000", JustificationValues.Left, "20", "280", 0, OXSimpleWordTableCellVerticalMerge.None, OXSimpleWordTableCellBorders.NoBottom));
            oxRow.Cells.Add(new OXSimpleWordTableCell(inv.SupplierFirmAccount, "3200", JustificationValues.Left, "20", "280", 0, OXSimpleWordTableCellVerticalMerge.None, OXSimpleWordTableCellBorders.NoBottom));
            oxTable.Rows.Add(oxRow);
            oxRow = new OXSimpleWordTableRow();
            oxRow.Cells.Add(new OXSimpleWordTableCell(inv.Supplier + (language == "English" ? "&&Recipient" : "&&Получатель"), "5500", JustificationValues.Left, "20", "280", 2, OXSimpleWordTableCellVerticalMerge.None, OXSimpleWordTableCellBorders.NoTop));
            oxRow.Cells.Add(new OXSimpleWordTableCell("", "1000", JustificationValues.Left, "20", "280", 0, OXSimpleWordTableCellVerticalMerge.None, OXSimpleWordTableCellBorders.NoTop));
            oxRow.Cells.Add(new OXSimpleWordTableCell("", "1000", JustificationValues.Left, "20", "280", 0, OXSimpleWordTableCellVerticalMerge.None, OXSimpleWordTableCellBorders.NoTop));
            //OXSimpleWordTableColumnOptions oxColOpts = new OXSimpleWordTableColumnOptions();
            oxTable.Rows.Add(oxRow);
            report.InsertTable(oxTable);

            report.SetParagraph(OXML.Aligment.LEFT, OXML.Interval.INT_15, 0);
            report.AddText("");

            if (language == "English")
                report.AddText(string.Format("Payable account No {0} от {1:dd.MM.yyyy}", inv.Number, inv.Date), true, true, 26);
            else
                report.AddText(string.Format("Счет на оплату № {0} от {1:dd.MM.yyyy}", inv.Number, inv.Date), true, true, 26);


            report.SetParagraph(OXML.Aligment.CENTER, OXML.Interval.INT_POINT_10pt, 0);
            report.AddText("___________________________________________________________");
            report.SetParagraph(OXML.Aligment.LEFT, OXML.Interval.INT_POINT_10pt, 0);
            report.AddText("");

            oxTable = new OXSimpleWordTable();
            oxTable.Border = 0;
            oxRow = new OXSimpleWordTableRow();
            oxRow.Cells.Add(new OXSimpleWordTableCell(language == "English" ? "Supplier" : "Поставщик", "2000", JustificationValues.Left, "18", "280"));
            oxRow.Cells.Add(new OXSimpleWordTableCell(inv.SupplierDetails + "&", "7700", JustificationValues.Left, "18", "280"));
            oxTable.Rows.Add(oxRow);

            string tail = "@#$%^";
            string customer = inv.Customer + tail;
            if (customer.Contains(", ООО" + tail))
                customer = "ООО " + customer.Replace(", ООО" + tail, string.Empty);
            if (customer.Contains("ООО" + tail))
                customer = "ООО " + customer.Replace("ООО" + tail, string.Empty);
            if (customer.Contains(", ЗАО" + tail))
                customer = "ЗАО " + customer.Replace(", ЗАО" + tail, string.Empty);
            if (customer.Contains("ЗАО" + tail))
                customer = "ЗАО " + customer.Replace("ЗАО" + tail, string.Empty);
            if (customer.Contains(", ОАО" + tail))
                customer = "ОАО " + customer.Replace(", ОАО" + tail, string.Empty);
            if (customer.Contains("ОАО" + tail))
                customer = "ОАО " + customer.Replace("ОАО" + tail, string.Empty);
            customer = customer.Replace(tail, string.Empty);

            if (customer == inv.Customer)  // замена не сработала
            {
                if (customer.Contains(" ООО"))
                {
                    customer = customer.Replace(" ООО", string.Empty);
                    customer = "ООО " + customer;
                }
                if (customer.Contains(" ЗАО"))
                {
                    customer = customer.Replace(" ЗАО", string.Empty);
                    customer = "ЗАО " + customer;
                }
                if (customer.Contains(" ОАО"))
                {
                    customer = customer.Replace(" ОАО", string.Empty);
                    customer = "ОАО " + customer;
                }
            }

            oxRow = new OXSimpleWordTableRow();
            oxRow.Cells.Add(new OXSimpleWordTableCell(language == "English" ? "Buyer" : "Покупатель", "2000", JustificationValues.Left, "18", "280"));
            oxRow.Cells.Add(new OXSimpleWordTableCell(customer, "7700", JustificationValues.Left, "18", "280"));
            oxTable.Rows.Add(oxRow);
            report.InsertTable(oxTable);
            report.SetParagraph(OXML.Aligment.LEFT, OXML.Interval.INT_POINT_10pt, 0);
            report.AddText("");
            report.AddText("");

            oxTable = new OXSimpleWordTable();
            oxTable.Border = 1;
            oxRow = new OXSimpleWordTableRow();
            OXSimpleWordTableCell cell1 = new OXSimpleWordTableCell("&№&", "700", JustificationValues.Center, "18", "240"); cell1.Bold = 1;
            OXSimpleWordTableCell cell2 = new OXSimpleWordTableCell(language == "English" ? "&Goods (works, services)" : "&Товары (работы, услуги)", "4000", JustificationValues.Center, "18", "240"); cell2.Bold = 1;
            OXSimpleWordTableCell cell3 = new OXSimpleWordTableCell(language == "English" ? "&Amount" : "&Кол-во", "1100", JustificationValues.Center, "18", "240"); cell3.Bold = 1;
            OXSimpleWordTableCell cell4 = new OXSimpleWordTableCell(language == "English" ? "&Units" : "&Ед.", "900", JustificationValues.Center, "18", "240"); cell4.Bold = 1;
            //OXSimpleWordTableCell cell5 = new OXSimpleWordTableCell(language == "English" ? "&Price" : "&Цена", "1500", JustificationValues.Center, "18", "240"); cell5.Bold = 1;
            OXSimpleWordTableCell cell5 = new OXSimpleWordTableCell(language == "English" ? "&Discount" : "&Скидка", "1500", JustificationValues.Center, "18", "240"); cell5.Bold = 1; //???
            OXSimpleWordTableCell cell6 = new OXSimpleWordTableCell(language == "English" ? "&Sum" : "&Сумма", "1500", JustificationValues.Center, "18", "240"); cell6.Bold = 1;
            oxRow.Cells.Add(cell1);
            oxRow.Cells.Add(cell2);
            oxRow.Cells.Add(cell3);
            oxRow.Cells.Add(cell4);
            oxRow.Cells.Add(cell5);
            oxRow.Cells.Add(cell6);
            //oxRow.Cells.Add(new OXSimpleWordTableCell("&Артикул", "1300", JustificationValues.Center, "18", "240"));
            oxTable.Rows.Add(oxRow);
            int numpp = 1;
            decimal summ = 0;
            foreach (var it in inv.Items)
            {
                int a = it.Quantity == null ? 0 : it.Quantity.Value;
                int d = it.DiscountedRate == null ? 0 : it.DiscountedRate.Value;
                decimal t = it.Price == null ? 0 : it.Price.Value;
                t *= courseUSD;

                string rate = d == null ? string.Empty : d.ToString("F2");
                string total = t == null ? string.Empty : t.ToString("F2");
                string amount = a == null ? string.Empty : a.ToString("F2");
                summ += t;
                oxRow = new OXSimpleWordTableRow();
                oxRow.Cells.Add(new OXSimpleWordTableCell("&" + numpp.ToString() + "&", "700", JustificationValues.Right, "18", "240"));
                //oxRow.Cells.Add(new OXSimpleWordTableCell("&" +  it.ArtNo + "&", "1300", JustificationValues.Left, "18", "240"));
                oxRow.Cells.Add(new OXSimpleWordTableCell("&" + it.ItemName + "&", "4000", JustificationValues.Left, "18", "240"));
                oxRow.Cells.Add(new OXSimpleWordTableCell("&" + amount + "&", "1100", JustificationValues.Right, "18", "240"));
                if (language == "English")
                    oxRow.Cells.Add(new OXSimpleWordTableCell("&" + it.Unit.Replace("MET", "пог.м.").Replace("YDS", "пог.м.") + "&", "900", JustificationValues.Left, "18", "240"));
                else
                    oxRow.Cells.Add(new OXSimpleWordTableCell("&" + it.Unit.Replace("YDS", "MET") + "&", "900", JustificationValues.Left, "18", "240"));
                oxRow.Cells.Add(new OXSimpleWordTableCell("&" + rate + "&", "1500", JustificationValues.Right, "18", "240"));
                oxRow.Cells.Add(new OXSimpleWordTableCell("&" + total + "&", "1500", JustificationValues.Right, "18", "240"));
                oxTable.Rows.Add(oxRow);
                numpp++;
            }

            report.InsertTable(oxTable);

            oxTable = new OXSimpleWordTable();
            oxTable.Border = 0;
            oxRow = new OXSimpleWordTableRow();
            oxRow.Cells.Add(new OXSimpleWordTableCell(language == "English" ? "Total" : "Итого", "8200", JustificationValues.Right, "18", "280", gridspan: 5));
            oxRow.Cells.Add(new OXSimpleWordTableCell(summ.ToString("F2"), "1500", JustificationValues.Right, "18", "280"));
            oxTable.Rows.Add(oxRow);
            if (inv.Supplier.ToLower().Contains("фэшн"))
            {
                oxRow = new OXSimpleWordTableRow();
                oxRow.Cells.Add(new OXSimpleWordTableCell(language == "English" ? "Including VAT" : "В том числе НДС", "8200", JustificationValues.Right, "18", "280", gridspan: 5));
                oxRow.Cells.Add(new OXSimpleWordTableCell((summ * 0.18m / 1.18m).ToString("F2"), "1500", JustificationValues.Right, "18", "280"));
                oxTable.Rows.Add(oxRow);
            }
            else
            {
                oxRow = new OXSimpleWordTableRow();
                oxRow.Cells.Add(new OXSimpleWordTableCell(language == "English" ? "Without tax (VAT)" : "Без налога (НДС)", "8200", JustificationValues.Right, "18", "280", gridspan: 5));
                oxRow.Cells.Add(new OXSimpleWordTableCell("-", "1500", JustificationValues.Right, "18", "280"));
                oxTable.Rows.Add(oxRow);
            }

            oxRow = new OXSimpleWordTableRow();
            oxRow.Cells.Add(new OXSimpleWordTableCell(language == "English" ? "" : "Total to pay", "8200", JustificationValues.Right, "18", "280", gridspan: 5));
            oxRow.Cells.Add(new OXSimpleWordTableCell(summ.ToString("F2"), "1500", JustificationValues.Right, "18", "280"));
            oxTable.Rows.Add(oxRow);
            report.InsertTable(oxTable);

            report.SetParagraph(OXML.Aligment.LEFT, OXML.Interval.INT_POINT_10pt, 0);
            report.AddText("");


            report.SetParagraph(OXML.Aligment.LEFT, OXML.Interval.INT_POINT_14pt, 0);
            if (inv.Currency == "USD")
                report.AddText(string.Format(language == "English" ? "Total items {0} in the amount of {1:F2} USD" : "Всего наименований {0} на сумму {1:F2} USD", numpp - 1, summ), false, true, 20);
            else
                report.AddText(string.Format(language == "English" ? "Total items {0} in the amount of {1:F2} RUR" : "Всего наименований {0} на сумму {1:F2} рублей", numpp - 1, summ), false, true, 20);


            if (language != "English")
            {
                string s = RuDateAndMoneyConverter.CurrencyToTxtFull(Convert.ToDouble(summ), true);
                if (inv.Currency != "USD")
                {
                    s = s.Replace("долларов", "рублей");
                    s = s.Replace("доллара", "рубля");
                    s = s.Replace("доллар", "рубль");
                    s = s.Replace("центов", "копеек");
                    s = s.Replace("цента", "копейки");
                    s = s.Replace("цент", "копейка");
                }
                report.AddText(string.Format(s, numpp, summ), true, true, 20);
            }

            report.AddText("");
            report.SetParagraph(OXML.Aligment.CENTER, OXML.Interval.INT_15, 0);
            if (language == "English")
            {
                if (inv.Currency != "RUR")
                {
                    report.AddText("Accounts shall be settled at the exchange rate on the payment date!", true, true, 24);
                }
                report.AddText("Paying in the payment details section number must accounts and contract.", true, true, 16);
            }
            else
            {
                if (inv.Currency != "RUR")
                {
                    report.AddText("ОПЛАТА СЧЕТА ПРОИЗВОДИТСЯ ПО КУРСУ ЦБ НА ДЕНЬ ОПЛАТЫ!", true, true, 24);
                }
                report.AddText("ПРИ ОПЛАТЕ В РАЗДЕЛЕ \"НАЗНАЧЕНИЕ ПЛАТЕЖА\" НЕОБХОДИМО УКАЗАТЬ НОМЕРА СЧЕТА И ДОГОВОРА.", true, true, 16);
            }

            report.SetParagraph(OXML.Aligment.CENTER, OXML.Interval.INT_POINT_14pt, 0);
            report.AddText("");
            //report.AddText("");

            //report.AddText(string.Format("Руководитель____________________{0}                      Бухгалтер____________________{1}", inv.SupplierHead, inv.SupplierAccountant), true, true, 16);


            if (inv.Supplier.ToLower().Contains("анжелика фэшн"))
                report.AddImage(1);
            if (inv.Supplier.ToLower().Contains("текстильная компания"))
                report.AddImage(2);
            if (inv.Supplier.ToLower().Contains("волкова наталья"))
                report.AddImage(3);
            if (inv.Supplier.ToLower().Contains("мода"))
                report.AddImage(4);


            OXSimpleWordOptions opts = new OXSimpleWordOptions();
            opts.Landscape = false;
            string file_name = report.GenerateDocument(path, fileName, opts);
            return file_name;
        }
    }
}

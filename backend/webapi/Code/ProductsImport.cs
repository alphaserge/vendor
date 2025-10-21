using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;

namespace chiffon_back.Code
{
    public class ColVar
    {
        public int ColorNo { get; set; }
        public int[] ColorIds { get; set; }
        public int Quantity { get; set; }
    }

    public class ProductItem
    {
        public int? Id { get; set; }
        public string? ArtNo { get; set; }
        public string? Design { get; set; }
        public string? ItemName { get; set; }
        public string? RefNo { get; set; }
        public ColVar[] ColVars { get; set; }
        public int? Weight { get; set; }
        public int? Width { get; set; }
        public int? GSM { get; set; }
        public int? ColorFastness { get; set; }
        public decimal? FabricShrinkage { get; set; }
        public decimal? MetersInKG { get; set; }
        public decimal? Price { get; set; }
        public decimal? Stock { get; set; }
        public decimal? RollLength { get; set; }
        public int? DyeStaffId { get; set; }
        public int? FinishingId { get; set; }
        public int? PlainDyedTypeId { get; set; }
        public int? PrintTypeId { get; set; }
        public int? ProductStyleId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? VendorId { get; set; }
    }

    public class ProductsImport
    {
        List<ProductItem> items;

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        ProductsImport()
        { 
            items = new List<ProductItem>();
        }

        public void ReadExcelFileDOM(string filePath, string sheetName, int branchId, bool checkMode)
        {
            ReadExcelFileSheet(filePath, sheetName, branchId, checkMode);
        }

        public string GetCellValue(Cell cell)
        {
            string text = cell.InnerText == null ? string.Empty : cell.InnerText;// CellValue.Text;
            return text;
        }

        // Retrieve the value of a cell, given a file name, sheet name, 
        // and address name.
        public static string GetCellValue(string fileName, string sheetName, string addressName)
        {
            string value = null;

            // Open the spreadsheet document for read-only access.
            using (SpreadsheetDocument document =
                SpreadsheetDocument.Open(fileName, false))
            {
                // Retrieve a reference to the workbook part.
                WorkbookPart wbPart = document.WorkbookPart;

                // Find the sheet with the supplied name, and then use that 
                // Sheet object to retrieve a reference to the first worksheet.
                Sheet? theSheet = wbPart.Workbook.Descendants<Sheet>().FirstOrDefault(s => s.Name == sheetName);

                // Throw an exception if there is no sheet.
                if (theSheet == null)
                {
                    throw new ArgumentException("sheetName");
                }

                // Retrieve a reference to the worksheet part.
                WorksheetPart wsPart =
                    (WorksheetPart)(wbPart.GetPartById(theSheet.Id));

                // Use its Worksheet property to get a reference to the cell 
                // whose address matches the address you supplied.
                Cell? theCell = wsPart.Worksheet.Descendants<Cell>().FirstOrDefault(c => c.CellReference == addressName);

                // If the cell does not exist, return an empty string.
                if (theCell != null)
                {
                    if (theCell.CellFormula != null)
                        value = theCell.CellFormula.Text;
                    else
                        value = theCell.InnerText;

                    // If the cell represents an integer number, you are done. 
                    // For dates, this code returns the serialized value that 
                    // represents the date. The code handles strings and 
                    // Booleans individually. For shared strings, the code 
                    // looks up the corresponding value in the shared string 
                    // table. For Booleans, the code converts the value into 
                    // the words TRUE or FALSE.
                    if (theCell.DataType != null)
                    {
                        switch (theCell.DataType.Value)
                        {
                            case CellValues.SharedString:

                                // For shared strings, look up the value in the
                                // shared strings table.
                                var stringTable =
                                    wbPart.GetPartsOfType<SharedStringTablePart>()
                                    .FirstOrDefault();

                                // If the shared string table is missing, something 
                                // is wrong. Return the index that is in
                                // the cell. Otherwise, look up the correct text in 
                                // the table.
                                if (stringTable != null)
                                {
                                    value =
                                        stringTable.SharedStringTable
                                        .ElementAt(int.Parse(value)).InnerText;
                                }
                                break;

                            case CellValues.Boolean:
                                switch (value)
                                {
                                    case "0":
                                        value = "FALSE";
                                        break;
                                    default:
                                        value = "TRUE";
                                        break;
                                }
                                break;
                        }
                    }
                }
            }
            return value;
        }

        public void ReadExcelFileSheet(string filePath, string sheetName, int branchId, bool checkMode)
        {
            int n = 2; // start import from line 2

            items = new List<ProductItem>();

            string artNo    = GetCellValue(filePath, sheetName, $"A{n}");
            string refNo    = GetCellValue(filePath, sheetName, $"B{n}");
            string itemName = GetCellValue(filePath, sheetName, $"C{n}");
            string design   = GetCellValue(filePath, sheetName, $"D{n}");
            string colNo    = GetCellValue(filePath, sheetName, $"E{n}");
            string colNames = GetCellValue(filePath, sheetName, $"F{n}").ToLower();
            string sqtyM    = GetCellValue(filePath, sheetName, $"G{n}");
            string sqtyR    = GetCellValue(filePath, sheetName, $"H{n}");
            string sprice   = GetCellValue(filePath, sheetName, $"I{n}");
            
            bool eof = string.IsNullOrEmpty( artNo ) && string.IsNullOrEmpty( itemName );
            int qtyM = -1;
            int qtyR = -1;
            if (!int.TryParse(sqtyM, out qtyM)) { qtyM = -1; }
            if (!int.TryParse(sqtyR, out qtyR)) { qtyR = -1; }

            string[] colorNames = colNames.Split(new char[] { ',', ';' });

            while (!eof)
            {
                Context.Product? existed = ctx.Products.FirstOrDefault(x => 
                    ((!String.IsNullOrWhiteSpace(x.ArtNo   ) && x.ArtNo.ToLower()    == artNo   .Trim().ToLower()) || (String.IsNullOrWhiteSpace(x.ArtNo)    && String.IsNullOrWhiteSpace(artNo))) &&
                    ((!String.IsNullOrWhiteSpace(x.ItemName) && x.ItemName.ToLower() == itemName.Trim().ToLower()) || (String.IsNullOrWhiteSpace(x.ItemName) && String.IsNullOrWhiteSpace(itemName))) &&
                    ((!String.IsNullOrWhiteSpace(x.Design  ) && x.Design.ToLower()   == design  .Trim().ToLower()) || (String.IsNullOrWhiteSpace(x.Design)   && String.IsNullOrWhiteSpace(design))));

                ProductItem item = new ProductItem();
                item.ArtNo = artNo;
                item.RefNo = refNo;
                item.ItemName = itemName;
                item.Design = design;

                if (existed != null) 
                { 
                    item.Id = existed.Id;
                    Context.ColorVariant? existedColorVar = String.IsNullOrWhiteSpace(colNo) ? null : ctx.ColorVariants.FirstOrDefault(x => x.Num.ToString() == colNo.Trim());
                    if (existedColorVar != null) 
                    { 
                        if ( qtyM > 0 )
                        {
                            existedColorVar.Quantity = qtyM;
                            ctx.SaveChanges();
                        }

                        string[] existedColNames = ctx.ColorVariantsInColors.Where(x => x.ColorVariantId == existedColorVar.Id).Select(x => ctx.Colors.FirstOrDefault(c => c.Id == x.ColorId).ColorName.ToLower()).ToArray();
                        if (colorNames.SequenceEqual( existedColNames ))
                        {
                            //...
                        }


                    }
                }

                

                Decimal price = 0;
                if (Decimal.TryParse(sprice, out price))
                {
                    item.Price = price;
                }
            }

            //try
            //{
            string stringDate = GetCellValue(filePath, sheetName, "A1");
            if (!DateTime.TryParse(stringDate, out date1))
            {
                X.Msg.Alert("error", "Date of stock not found").Show();
                return;
            }

            int row = 3;

            int errUnit = 0, errUnit_01 = 0, errUnit_02 = 0, errUnit_03 = 0, errFound = 0;
            List<int> ids1 = new List<int>();
            List<ImportedRecord> excelRecs = new List<ImportedRecord>();

            while (true)
            {
                ImportedRecord rec = new ImportedRecord();
                rec.ArtNo = GetCellValue(filePath, sheetName, String.Format("B{0}", row));
                rec.RefNo = GetCellValue(filePath, sheetName, String.Format("C{0}", row));
                rec.ProdName = GetCellValue(filePath, sheetName, String.Format("D{0}", row));
                rec.Design = GetCellValue(filePath, sheetName, String.Format("E{0}", row));
                rec.Color = GetCellValue(filePath, sheetName, String.Format("F{0}", row));
                rec.ColorName = GetCellValue(filePath, sheetName, String.Format("G{0}", row));
                if (String.IsNullOrWhiteSpace(rec.ArtNo) && String.IsNullOrWhiteSpace(rec.RefNo) && String.IsNullOrWhiteSpace(rec.ProdName))
                {
                    break;
                }

                string rollString = GetCellValue(filePath, sheetName, String.Format("H{0}", row));
                string yardsString = GetCellValue(filePath, sheetName, String.Format("I{0}", row));
                string metersString = GetCellValue(filePath, sheetName, String.Format("J{0}", row));
                string kgsString = GetCellValue(filePath, sheetName, String.Format("K{0}", row));
                decimal rolls = Helper.GetDetailAmount(rollString); //Decimal.TryParse(rollString, out rolls) ? rolls : 0m;
                decimal yards = Helper.GetDetailAmount(yardsString); // Decimal.TryParse(yardsString, out yards) ? yards : 0m;
                decimal meters = Helper.GetDetailAmount(metersString); //Decimal.TryParse(metersString, out meters) ? meters : 0m;
                decimal kgs = Helper.GetDetailAmount(kgsString); //Decimal.TryParse(kgsString, out kgs) ? kgs : 0m;
                rec.Rolls = rolls;
                rec.Quantity = 0m; // yards > 0m ? yards : (meters > 0m ? meters : kgs);

                if (yards > 0m)
                {
                    rec.Quantity = yards;
                    rec.UnitName = "YDS";
                }
                else if (meters > 0m)
                {
                    rec.Quantity = meters;
                    rec.UnitName = "MET";
                }
                else if (kgs > 0m)
                {
                    rec.Quantity = kgs;
                    rec.UnitName = "KGS";
                }

                // попытка найти товар только по ArtNo, Color
                var products1 = ctx.Products
                    .Where(x =>
                        x.ArtNo.ToLower() == rec.ArtNo.EmptyWhenNull().ToLower().Trim() &&
                        x.Color.ToLower() == rec.Color.EmptyWhenNull().ToLower().Trim()
                        );

                var products2 = ctx.Products
                        .Where(x =>
                            x.ArtNo.ToLower() == rec.ArtNo.EmptyWhenNull().ToLower().Trim() &&
                            x.Color.ToLower() == rec.Color.EmptyWhenNull().ToLower().Trim() &&
                            x.ColorName.ToLower() == rec.ColorName.EmptyWhenNull().ToLower().Trim()
                            );

                var products3 = ctx.Products
                        .Where(x =>
                            x.ArtNo.ToLower() == rec.ArtNo.EmptyWhenNull().ToLower().Trim() &&
                            x.Design.ToLower() == rec.Design.EmptyWhenNull().ToLower().Trim() &&
                            x.ProdName.ToLower().Replace("  ", " ") == rec.ProdName.EmptyWhenNull().ToLower().Trim()
                            );

                var products4 = ctx.Products
                        .Where(x =>
                            x.ArtNo.ToLower() == rec.ArtNo.EmptyWhenNull().ToLower().Trim() &&
                            x.Color.ToLower() == rec.Color.EmptyWhenNull().ToLower().Trim() &&
                            x.Design.ToLower() == rec.Design.EmptyWhenNull().ToLower().Trim()
                            );

                var products5 = ctx.Products
                    .Where(x =>
                        x.ArtNo.ToLower() == rec.ArtNo.EmptyWhenNull().ToLower().Trim() &&
                        x.Color.ToLower() == rec.Color.EmptyWhenNull().ToLower().Trim() &&
                        x.ColorName.ToLower() == rec.ColorName.EmptyWhenNull().ToLower().Trim() &&
                        x.ProdName.ToLower().Replace("  ", " ") == rec.ProdName.EmptyWhenNull().ToLower().Trim()
                        );

                var products6 = ctx.Products
                        .Where(x =>
                            x.ArtNo.ToLower() == rec.ArtNo.EmptyWhenNull().ToLower().Trim() &&
                            x.Color.ToLower() == rec.Color.EmptyWhenNull().ToLower().Trim() &&
                            x.ColorName.ToLower() == rec.ColorName.EmptyWhenNull().ToLower().Trim() &&
                            x.RefNo.ToLower() == rec.RefNo.EmptyWhenNull().ToLower().Trim()
                            );

                var products7 = ctx.Products
                        .Where(x =>
                            x.ArtNo.ToLower() == rec.ArtNo.EmptyWhenNull().ToLower().Trim() &&
                            x.Color.ToLower() == rec.Color.EmptyWhenNull().ToLower().Trim() &&
                            x.RefNo.ToLower() == rec.RefNo.EmptyWhenNull().ToLower().Trim() &&
                            x.Design.ToLower() == rec.Design.EmptyWhenNull().ToLower().Trim() &&
                            x.ColorName.ToLower() == rec.ColorName.EmptyWhenNull().ToLower().Trim()
                            );

                var products8 = ctx.Products
                        .Where(x =>
                            x.ArtNo.ToLower() == rec.ArtNo.EmptyWhenNull().ToLower().Trim() &&
                            x.Color.ToLower() == rec.Color.EmptyWhenNull().ToLower().Trim() &&
                            x.RefNo.ToLower() == rec.RefNo.EmptyWhenNull().ToLower().Trim() &&
                            x.Design.ToLower() == rec.Design.EmptyWhenNull().ToLower().Trim() &&
                            x.ColorName.ToLower() == rec.ColorName.EmptyWhenNull().ToLower().Trim() &&
                            x.ProdName.ToLower().Replace("  ", " ") == rec.ProdName.EmptyWhenNull().ToLower().Trim()
                            );
                var products0 = ctx.Products
                        .Where(x =>
                            x.ArtNo == null && rec.ArtNo.EmptyWhenNull() == string.Empty &&
                            x.Color.ToLower() == rec.Color.EmptyWhenNull().ToLower().Trim() &&
                            x.RefNo.ToLower() == rec.RefNo.EmptyWhenNull().ToLower().Trim() &&
                            x.Design.ToLower() == rec.Design.EmptyWhenNull().ToLower().Trim() &&
                            x.ColorName.ToLower() == rec.ColorName.EmptyWhenNull().ToLower().Trim() &&
                            x.ProdName.ToLower().Replace("  ", " ") == rec.ProdName.EmptyWhenNull().ToLower().Trim()
                            );

                IQueryable<Products> products = null;

                // наибольший приоритет имеет запрос, который вернул 1 запись,
                // также запрос с большим номером имеет больший приоритет, т.к. он более точный
                if (products8.Count() == 1)
                    products = products8;
                else if (products7.Count() == 1)
                    products = products7;
                else if (products6.Count() == 1)
                    products = products6;
                else if (products5.Count() == 1)
                    products = products5;
                else if (products4.Count() == 1)
                    products = products4;
                else if (products3.Count() == 1)
                    products = products3;
                else if (products2.Count() == 1)
                    products = products2;
                else if (products1.Count() == 1)
                    products = products1;
                else if (products0.Count() == 1)
                    products = products0;
                else if (products8.Count() > 1)
                    products = products8;
                else if (products7.Count() > 1)
                    products = products7;
                else if (products6.Count() > 1)
                    products = products6;
                else if (products5.Count() > 1)
                    products = products5;
                else if (products4.Count() > 1)
                    products = products4;
                else if (products3.Count() > 1)
                    products = products3;
                else if (products2.Count() > 1)
                    products = products2;
                else if (products1.Count() > 1)
                    products = products1;
                else if (products0.Count() > 1)
                    products = products0;

                string delim = string.Empty;
                if (products != null)
                {
                    foreach (var p in products)
                    {
                        if (rec.ProductId == 0)
                        {
                            rec.ProductId = p.id;
                            ids1.Add(p.id);
                        }
                        rec.FoundId += delim + p.id;
                        rec.FoundArtNo += delim + p.ArtNo;
                        rec.FoundRefNo += delim + p.RefNo;
                        rec.FoundProdName += delim + p.ProdName;
                        rec.FoundDesign += delim + p.Design;
                        rec.FoundColor += delim + p.Color;
                        rec.FoundColorName += delim + p.ColorName;
                        delim = "; ";
                        rec.K = 1m;
                        if (String.IsNullOrEmpty(rec.UnitName)) rec.UnitName = p.Units.UnitName;
                        if (p.Units.UnitName != rec.UnitName)
                        {
                            errUnit++;
                            if (p.Units.UnitName == "YDS" && rec.UnitName == "MET")
                            {
                                rec.K = 1.0936m;
                                errUnit_01++;
                            }
                            else if (p.Units.UnitName == "MET" && rec.UnitName == "YDS")
                            {
                                rec.K = 0.9144m;
                                errUnit_02++;
                            }
                            else
                            {
                                errUnit_03++;
                            }
                        }
                        rec.Quantity *= rec.K;
                    }
                }
                else
                {
                    errFound++;
                }

                excelRecs.Add(rec);
                row++; n++;
            }



        }
    }

using chiffon_back.Context;
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

            string artNo = GetCellValue(filePath, sheetName, $"A{n}");
            string refNo = GetCellValue(filePath, sheetName, $"B{n}");
            string itemName = GetCellValue(filePath, sheetName, $"C{n}");
            string design = GetCellValue(filePath, sheetName, $"D{n}");
            string colNum = GetCellValue(filePath, sheetName, $"E{n}");
            string colNames = GetCellValue(filePath, sheetName, $"F{n}").ToLower();
            string sqtyM = GetCellValue(filePath, sheetName, $"G{n}");
            string sqtyR = GetCellValue(filePath, sheetName, $"H{n}");
            string sprice = GetCellValue(filePath, sheetName, $"I{n}");

            bool eof = string.IsNullOrEmpty(artNo) && string.IsNullOrEmpty(itemName);
            int qtyM = -1;
            int qtyR = -1;
            if (!int.TryParse(sqtyM, out qtyM)) { qtyM = -1; }
            if (!int.TryParse(sqtyR, out qtyR)) { qtyR = -1; }

            string[] colorNames = colNames.Split(new char[] { ',', ';' });

            while (!eof)
            {
                Context.Product? existed = ctx.Products.FirstOrDefault(x =>
                    ((!String.IsNullOrWhiteSpace(x.ArtNo) && x.ArtNo.ToLower() == artNo.Trim().ToLower()) || (String.IsNullOrWhiteSpace(x.ArtNo) && String.IsNullOrWhiteSpace(artNo))) &&
                    ((!String.IsNullOrWhiteSpace(x.ItemName) && x.ItemName.ToLower() == itemName.Trim().ToLower()) || (String.IsNullOrWhiteSpace(x.ItemName) && String.IsNullOrWhiteSpace(itemName))) &&
                    ((!String.IsNullOrWhiteSpace(x.Design) && x.Design.ToLower() == design.Trim().ToLower()) || (String.IsNullOrWhiteSpace(x.Design) && String.IsNullOrWhiteSpace(design))));

                ProductItem item = new ProductItem();
                item.ArtNo = artNo;
                item.RefNo = refNo;
                item.ItemName = itemName;
                item.Design = design;

                Decimal price = 0;
                if (Decimal.TryParse(sprice, out price))
                {
                    item.Price = price;
                }

                if (existed != null)
                {
                    item.Id = existed.Id;
                    int colNo = -1;
                    if (int.TryParse(colNum.Trim(), out colNo)) 
                    {
                        Context.ColorVariant? existedColorVar = ctx.ColorVariants.FirstOrDefault(x => x.Num == colNo);
                        if (existedColorVar != null)
                        {
                            if (qtyM > 0)
                            {
                                existedColorVar.Quantity = qtyM;
                                ctx.SaveChanges();
                            }

                            var colVarsInColors = ctx.ColorVariantsInColors.Where(x => x.ColorVariantId == existedColorVar.Id);
                            string[] existedColNames = colVarsInColors.Select(x => ctx.Colors.FirstOrDefault(c => c.Id == x.ColorId).ColorName.ToLower()).ToArray();
                            if (!colorNames.SequenceEqual(existedColNames))
                            {
                                ctx.ColorVariantsInColors.RemoveRange(ctx.ColorVariantsInColors.Where(x => x.ColorVariantId == existedColorVar.Id));
                                foreach (int colorId in colVarsInColors.Select(x => x.ColorId))
                                {
                                    ctx.ColorVariantsInColors.Add(new ColorVariantsInColors() { ColorId = colorId, ColorVariantId = existedColorVar.Id });
                                }
                                ctx.SaveChanges();
                            } 
                            /* nothing to do..
                            else
                            {
                                foreach (string colorName in colorNames)
                                {
                                    int? colorId = ctx.Colors.FirstOrDefault(x => x.ColorName != null && x.ColorName.ToLower() == colorName).Id;
                                    if (colorId != null)
                                    {
                                        ColorVariantsInColors? colVarInColors = ctx.ColorVariantsInColors.FirstOrDefault(x => x.ColorVariantId == existedColorVar.Id && x.ColorId == colorId);
                                        if (colVarInColors != null)
                                        {
                                            colVarInColors.qu
                                        }

                                            //.Add(new ColorVariantsInColors() { ColorId = colorId.Value, ColorVariantId = newColorVar.Id });
                                    }
                                }
                                ctx.SaveChanges();
                            }*/
                        }
                    } 
                    else
                    {
                        Product prod = new Product()
                        {
                            ArtNo = artNo,
                            RefNo = refNo,
                            ItemName = itemName,
                            Design = design
                        };
                        ctx.Products.Add(prod);
                        ctx.SaveChanges();

                        ColorVariant newColorVar = new ColorVariant() { Num = colNo, Price = price, ProductId = prod.Id, Quantity = qtyM, Uuid = Guid.NewGuid().ToString() };

                        ctx.ColorVariants.Add(newColorVar);
                        ctx.SaveChanges();


                        foreach (string colorName in colorNames)
                        {
                            int? colorId = ctx.Colors.FirstOrDefault(x => x.ColorName != null && x.ColorName.ToLower() == colorName).Id;
                            if (colorId != null)
                            {
                                ctx.ColorVariantsInColors.Add(new ColorVariantsInColors() { ColorId = colorId.Value, ColorVariantId = newColorVar.Id });
                            }
                        }
                        ctx.SaveChanges();

                    }
                }
            }


        }
    }
}

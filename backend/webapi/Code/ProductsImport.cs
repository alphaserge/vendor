using chiffon_back.Context;
using chiffon_back.Models;
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
        private static readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        public static string GetCellValue(Cell cell)
        {
            string text = cell.InnerText == null ? string.Empty : cell.InnerText;// CellValue.Text;
            return text;
        }

        // Retrieve the value of a cell, given a file name, sheet name, 
        // and address name.
        public static string GetCellValue(string fileName, string addressName) // 2-nd parameter was: string sheetName, 
        {
            string value = null;

            // Open the spreadsheet document for read-only access.
            using (SpreadsheetDocument document =
                SpreadsheetDocument.Open(fileName, false))
            {
                // Retrieve a reference to the workbook part.
                WorkbookPart wbPart = document.WorkbookPart;

                Workbook workbook = wbPart.Workbook;
                Sheets sheets = workbook.Sheets;


                // Find the sheet with the supplied name, and then use that 
                // Sheet object to retrieve a reference to the first worksheet.
                Sheet? theSheet = wbPart.Workbook.Descendants<Sheet>().FirstOrDefault(); // take first sheet!!!  older: (s => s.Name == sheetName);

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
            return value != null ? value : "";
        }

        public static void ReadExcelFile(string filePath, int vendorId)
        {
            DateTime created = DateTime.Now;

            int n = 2; // start import from line 2

            string artNo                = GetCellValue(filePath, $"A{n}");
            string refNo                = GetCellValue(filePath, $"B{n}");
            string itemName             = GetCellValue(filePath, $"C{n}");
            string design               = GetCellValue(filePath, $"D{n}");
            string colNum               = GetCellValue(filePath, $"E{n}");
            string colNames             = GetCellValue(filePath, $"F{n}");
            string sqtyM                = GetCellValue(filePath, $"G{n}");
            string sqtyR                = GetCellValue(filePath, $"H{n}");
            string sprice               = GetCellValue(filePath, $"I{n}");
            string plainOrPrint         = GetCellValue(filePath, $"J{n}");
            string plainDyedType        = GetCellValue(filePath, $"K{n}");
            string fabricType           = GetCellValue(filePath, $"L{n}");
            string designTypes          = GetCellValue(filePath, $"M{n}");
            string seasons              = GetCellValue(filePath, $"N{n}");
            string overworkTypes        = GetCellValue(filePath, $"O{n}");
            string finishing            = GetCellValue(filePath, $"P{n}");
            string printType            = GetCellValue(filePath, $"Q{n}");
            string dyeStaff             = GetCellValue(filePath, $"R{n}");
            string composition          = GetCellValue(filePath, $"S{n}");
            string width                = GetCellValue(filePath, $"T{n}");
            string gsm                  = GetCellValue(filePath, $"U{n}");
            string rollLength           = GetCellValue(filePath, $"V{n}");
            string fabricConstruction   = GetCellValue(filePath, $"W{n}");
            string fabricYarnCount      = GetCellValue(filePath, $"X{n}");
            string fabricShrinkage      = GetCellValue(filePath, $"Y{n}");
            string colorFastness        = GetCellValue(filePath, $"Z{n}");
            string hsCode               = GetCellValue(filePath, $"AA{n}");

            bool eof = string.IsNullOrEmpty(artNo) && string.IsNullOrEmpty(itemName);

            if (!String.IsNullOrWhiteSpace(colNames))
            {
                colNames = colNames.ToLower();
            }

            int qtyM = -1;
            int qtyR = -1;
            if (!int.TryParse(sqtyM, out qtyM)) { qtyM = -1; }
            if (!int.TryParse(sqtyR, out qtyR)) { qtyR = -1; }

            string[] colorNames = colNames.Split(new char[] { ',', ';' }).Select(x=>x.Trim()).ToArray();

            Context.Product? prod = null;
            while (!eof)
            {
                Context.Product? existed = ctx.Products.FirstOrDefault(x =>
                    x.VendorId == vendorId &&
                    ((!String.IsNullOrWhiteSpace(x.ArtNo) && !String.IsNullOrWhiteSpace(artNo) && x.ArtNo.ToLower() == artNo.Trim().ToLower()) || (String.IsNullOrWhiteSpace(x.ArtNo) && String.IsNullOrWhiteSpace(artNo))) &&
                    ((!String.IsNullOrWhiteSpace(x.ItemName) && !String.IsNullOrWhiteSpace(itemName) && x.ItemName.ToLower() == itemName.Trim().ToLower()) || (String.IsNullOrWhiteSpace(x.ItemName) && String.IsNullOrWhiteSpace(itemName))) &&
                    ((!String.IsNullOrWhiteSpace(x.Design) && !String.IsNullOrWhiteSpace(design) && x.Design.ToLower() == design.Trim().ToLower()) || (String.IsNullOrWhiteSpace(x.Design) && String.IsNullOrWhiteSpace(design))));


                Decimal price = 0;
                Decimal.TryParse(sprice, out price);

                if (existed != null)
                {
                    //item.Id = existed.Id;
                    int colNo = -1;
                    if (int.TryParse(colNum.Trim(), out colNo))
                    {
                        Context.ColorVariant? existedColorVar = ctx.ColorVariants.FirstOrDefault(x => x.ProductId == existed.Id && x.Num == colNo);
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
                                foreach (string colorName in colorNames)
                                {
                                    int? colorId = ctx.Colors.FirstOrDefault(x => x.ColorName.ToLower() == colorName.ToLower()).Id;
                                    if (colorId != null)
                                    {
                                        ctx.ColorVariantsInColors.Add(new Context.ColorVariantsInColors() { ColorId = colorId.Value, ColorVariantId = existedColorVar.Id });
                                    }
                                }
                                ctx.SaveChanges();
                            }
                            /* nothing to do..
                            else
                            {
                                foreach (string colorName in colorNames)
                                {
                                    int? colorId = ctx.ColorPhotos.FirstOrDefault(x => x.ColorName != null && x.ColorName.ToLower() == colorName).Id;
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
                        else
                        {
                            Context.ColorVariant newColorVar = new Context.ColorVariant()
                            {
                                Num = colNo,
                                Price = price,
                                ProductId = existed.Id,
                                Quantity = qtyM,
                                Uuid = Guid.NewGuid().ToString() // --only when photo is exists: 
                            };
                            ctx.ColorVariants.Add(newColorVar);
                            ctx.SaveChanges();
                            foreach (string colorName in colorNames)
                            {
                                int? colorId = ctx.Colors.FirstOrDefault(x => x.ColorName != null && x.ColorName.ToLower() == colorName).Id;
                                if (colorId != null)
                                {
                                    ctx.ColorVariantsInColors.Add(new Context.ColorVariantsInColors() { ColorId = colorId.Value, ColorVariantId = newColorVar.Id });
                                }
                            }
                            ctx.SaveChanges();

                        }
                    }

                    prod = existed;
                    prod.ProductStyleId = null;
                    prod.ProductTypeId = null;
                    prod.PrintTypeId = null;
                    prod.GSM = null;
                    prod.Width = null;
                    prod.FabricShrinkage = null;
                    prod.FabricYarnCount = null;
                    prod.FabricConstruction = null;
                    prod.DyeStaffId = null;
                    prod.PlainDyedTypeId = null;
                    prod.ColorFastness = null;
                    prod.HSCode = null;
                    prod.FinishingId = null;
                    prod.RollLength = null;

                    ctx.ProductsInDesignTypes.RemoveRange(ctx.ProductsInDesignTypes.Where(x => x.ProductId == prod.Id));
                    ctx.ProductsInOverWorkTypes.RemoveRange(ctx.ProductsInOverWorkTypes.Where(x => x.ProductId == prod.Id));
                    ctx.ProductsInSeasons.RemoveRange(ctx.ProductsInSeasons.Where(x => x.ProductId == prod.Id));
                    ctx.SaveChanges();


                }
                else
                {
                    prod = new Context.Product()
                    {
                        VendorId = vendorId,
                        Created = created,
                        ArtNo = artNo,
                        RefNo = refNo,
                        ItemName = itemName,
                        Design = design
                    };
                    ctx.Products.Add(prod);
                    ctx.SaveChanges();

                    int colNo = -1;
                    if (int.TryParse(colNum.Trim(), out colNo))
                    {
                        Context.ColorVariant newColorVar = new Context.ColorVariant() 
                        { 
                            Num = colNo, 
                            Price = price, 
                            ProductId = prod.Id, 
                            Quantity = qtyM, 
                            Uuid = Guid.NewGuid().ToString() // --only when photo is exists: 
                        };
                        ctx.ColorVariants.Add(newColorVar);
                        ctx.SaveChanges();
                        foreach (string colorName in colorNames)
                        {
                            int? colorId = ctx.Colors.FirstOrDefault(x => x.ColorName != null && x.ColorName.ToLower() == colorName).Id;
                            if (colorId != null)
                            {
                                ctx.ColorVariantsInColors.Add(new Context.ColorVariantsInColors() { ColorId = colorId.Value, ColorVariantId = newColorVar.Id });
                            }
                        }
                        ctx.SaveChanges();
                    }
                }

                if (prod != null)
                {
                    prod.FabricYarnCount = fabricYarnCount;
                    prod.FabricConstruction = fabricConstruction;
                    prod.HSCode = hsCode;


                    int m = 0;
                    if (int.TryParse(gsm, out m)) prod.GSM = m;
                    if (int.TryParse(colorFastness, out m)) prod.ColorFastness = m;
                    if (int.TryParse(width, out m)) prod.Width = m;

                    decimal d = 0;
                    if (decimal.TryParse(fabricShrinkage, out d)) prod.FabricShrinkage = d;
                    if (decimal.TryParse(rollLength, out d)) prod.RollLength = d;
                    //!!prod.MetersInKG = ;

                    var productStyle = ctx.ProductStyles.FirstOrDefault(x => x.StyleName.ToLower() == plainOrPrint.ToLower());
                    if (productStyle != null)
                    {
                        prod.ProductStyleId = productStyle.Id;
                    }

                    var productType = ctx.ProductTypes.FirstOrDefault(x => x.TypeName.ToLower() == fabricType.ToLower());
                    if (productType != null)
                    {
                        prod.ProductTypeId = productType.Id;
                    }

                    var _printType = ctx.PrintTypes.FirstOrDefault(x => x.TypeName.ToLower() == printType.ToLower());
                    if (_printType != null)
                    {
                        prod.PrintTypeId = _printType.Id;
                    }

                    var _dyeStaff = ctx.DyeStaffs.FirstOrDefault(x => x.DyeStaffName.ToLower() == dyeStaff.ToLower());
                    if (_dyeStaff != null)
                    {
                        prod.DyeStaffId = _dyeStaff.Id;
                    }

                    var _plainDyedType = ctx.PlainDyedTypes.FirstOrDefault(x => x.PlainDyedTypeName.ToLower() == plainDyedType.ToLower());
                    if (_plainDyedType != null)
                    {
                        prod.PlainDyedTypeId = _plainDyedType.Id;
                    }

                    var _finishing = ctx.Finishings.FirstOrDefault(x => x.FinishingName.ToLower() == finishing.ToLower());
                    if (_finishing != null)
                    {
                        prod.FinishingId = _finishing.Id;
                    }
                    ctx.SaveChanges();

                    foreach (var designType in designTypes.ToLower().Split(new char[] { ',', ';' }).Select(x => x.Trim()))
                    {
                        var data = ctx.DesignTypes.FirstOrDefault(x => x.DesignName.ToLower() == designType);
                        if (data != null)
                        {
                            ctx.ProductsInDesignTypes.Add(new Context.ProductsInDesignTypes() { DesignTypeId = data.Id, ProductId = prod.Id });
                        }
                    }
                    ctx.SaveChanges();

                    foreach (var overWorkType in overworkTypes.ToLower().Split(new char[] { ',', ';' }).Select(x => x.Trim()))
                    {
                        var data = ctx.OverWorkTypes.FirstOrDefault(x => x.OverWorkName.ToLower() == overWorkType);
                        if (data != null)
                        {
                            ctx.ProductsInOverWorkTypes.Add(new Context.ProductsInOverWorkTypes() { OverWorkTypeId = data.Id, ProductId = prod.Id });
                        }
                    }
                    ctx.SaveChanges();

                    foreach (var season in seasons.ToLower().Split(new char[] { ',', ';' }).Select(x => x.Trim()))
                    {
                        var data = ctx.Seasons.FirstOrDefault(x => x.SeasonName.ToLower() == season);
                        if (data != null)
                        {
                            ctx.ProductsInSeasons.Add(new Context.ProductsInSeasons() { SeasonId = data.Id, ProductId = prod.Id });
                        }
                    }
                    ctx.SaveChanges();

                    ctx.ProductsInTextileTypes.RemoveRange(ctx.ProductsInTextileTypes.Where(x=>x.ProductId == prod.Id));
                    ctx.SaveChanges();

                    string[] parts = composition.Split(new char[] {',',';'}, StringSplitOptions.RemoveEmptyEntries);
                    foreach(string part in parts)
                    {
                        string[] terms = part.Split(new char[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries);
                        if (terms.Length == 2)
                        {
                            string perc  = terms[0].Replace("%","").Trim();
                            string ttype = terms[1].Trim();
                            int percent = 0;
                            if (int.TryParse(perc, out percent))
                            {
                                var data = ctx.TextileTypes.FirstOrDefault(x => x.TextileTypeName.ToLower() == ttype.ToLower());
                                if (data != null)
                                {
                                    ctx.ProductsInTextileTypes.Add(new Context.ProductsInTextileTypes() { TextileTypeId = data.Id, ProductId = prod.Id, Value = percent });
                                }
                            }
                        }
                    }
                    ctx.SaveChanges();

                }

                n++;

                artNo = GetCellValue(filePath, $"A{n}");
                refNo = GetCellValue(filePath, $"B{n}");
                itemName = GetCellValue(filePath, $"C{n}");
                design = GetCellValue(filePath, $"D{n}");
                colNum = GetCellValue(filePath, $"E{n}");
                colNames = GetCellValue(filePath, $"F{n}");
                sqtyM = GetCellValue(filePath, $"G{n}");
                sqtyR = GetCellValue(filePath, $"H{n}");
                sprice = GetCellValue(filePath, $"I{n}");
                plainOrPrint = GetCellValue(filePath, $"J{n}");
                plainDyedType = GetCellValue(filePath, $"K{n}");
                fabricType = GetCellValue(filePath, $"L{n}");
                designTypes = GetCellValue(filePath, $"M{n}");
                seasons = GetCellValue(filePath, $"N{n}");
                overworkTypes = GetCellValue(filePath, $"O{n}");
                finishing = GetCellValue(filePath, $"P{n}");
                printType = GetCellValue(filePath, $"Q{n}");
                dyeStaff = GetCellValue(filePath, $"R{n}");
                composition = GetCellValue(filePath, $"S{n}");
                width = GetCellValue(filePath, $"T{n}");
                gsm = GetCellValue(filePath, $"U{n}");
                rollLength = GetCellValue(filePath, $"V{n}");
                fabricConstruction = GetCellValue(filePath, $"W{n}");
                fabricYarnCount = GetCellValue(filePath, $"X{n}");
                fabricShrinkage = GetCellValue(filePath, $"Y{n}");
                colorFastness = GetCellValue(filePath, $"Z{n}");
                hsCode = GetCellValue(filePath, $"AA{n}");
                eof = string.IsNullOrEmpty(artNo) && string.IsNullOrEmpty(itemName);

                if (!String.IsNullOrWhiteSpace(colNames))
                {
                    colNames = colNames.ToLower();
                }
                colorNames = String.IsNullOrWhiteSpace(colNames) ? [] : colNames.Split(new char[] { ',', ';' }).Select(x => x.Trim()).ToArray();

                qtyM = -1;
                qtyR = -1;
                if (!int.TryParse(sqtyM, out qtyM)) { qtyM = -1; }
                if (!int.TryParse(sqtyR, out qtyR)) { qtyR = -1; }
            }
        }
    }
}

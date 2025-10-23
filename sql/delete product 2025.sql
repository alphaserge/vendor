use [chiffon]

SELECT TOP (1000) [Id]
      ,[RefNo]
      ,[ArtNo]
      ,[ItemName]
      ,[Design]
      ,[ColorNo]
      ,[ColorName]
      ,[PhotoDir]
      ,[Price]
      ,[Weight]
      ,[Width]
      ,[ProductStyleId]
      ,[ProductTypeId]
      ,[VendorId]
      ,[Uuid]
      ,[FileName]
      ,[PhotoUuids]
      ,[Created]
      ,[GSM]
      ,[PrintTypeId]
      ,[FabricShrinkage]
      ,[DyeStaffId]
      ,[FabricConstruction]
      ,[FabricYarnCount]
      ,[PlainDyedTypeId]
      ,[ColorFastness]
      ,[Findings]
      ,[MetersInKG]
      ,[HSCode]
      ,[FinishingId]
      ,[Stock]
      ,[VideoUuids]
      ,[RollLength]
  FROM [chiffon].[dbo].[Products]

  declare @id int = 175
  delete FROM ColorVariantsInColors where ColorVariantId in (select Id FROM ColorVariants where ProductId>=@id)
  delete FROM ColorVariants where ProductId>=@id

  delete FROM ProductsInDesignTypes where ProductId>=@id
  delete FROM ProductsInOverWorkTypes where ProductId>=@id
  delete FROM ProductsInSeasons where ProductId>=@id
  delete FROM ProductsInTextileTypes where ProductId>=@id
  delete FROM Products where Id>=@id



/****** Скрипт для команды SelectTopNRows из среды SSMS  ******/

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
  FROM [chiffon].[dbo].[Products]

  -- 


SELECT TOP (1000) [Id]
      ,[ProductId]
      ,[Uuid]
  FROM [chiffon].[dbo].[ColorVariants] 


   delete from ColorVariantsInColors where ColorVariantId in (select Id FROM [chiffon].[dbo].[ColorVariants] where ProductId in (74))

   delete   FROM [chiffon].[dbo].[ColorVariants] where ProductId in (74)

   delete from ProductsInDesignTypes where ProductId in (74)
   delete from ProductsInSeasons where ProductId in (74)
   delete from ProductsInOverWorkTypes where ProductId in (74)

   delete FROM [chiffon].[dbo].[Products] where Id in (74)
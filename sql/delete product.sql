
declare @id int
set @id = 84

delete from ColorVariantsInColors where ColorVariantId in (select Id FROM [chiffon].[dbo].[ColorVariants] where ProductId in (@id))
delete   FROM [chiffon].[dbo].[ColorVariants] where ProductId in (@id)
delete from ProductsInDesignTypes where ProductId in (@id)
delete from ProductsInSeasons where ProductId in (@id)
delete from ProductsInOverWorkTypes where ProductId in (@id)

delete FROM [chiffon].[dbo].[Products] where Id in (@id)

SELECT * FROM [chiffon].[dbo].[Products]
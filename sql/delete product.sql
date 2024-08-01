
--declare @id int
--set @id = 90
DECLARE @id int = 91

WHILE @id < 113
BEGIN

delete from ColorVariantsInColors where ColorVariantId in (select Id FROM [chiffon].[dbo].[ColorVariants] where ProductId in (@id))
delete   FROM [chiffon].[dbo].[ColorVariants] where ProductId in (@id)
delete from ProductsInDesignTypes where ProductId in (@id)
delete from ProductsInSeasons where ProductId in (@id)
delete from ProductsInOverWorkTypes where ProductId in (@id)

delete FROM [chiffon].[dbo].[Products] where Id in (@id)

    /* do some work */

    SET @id = @id + 1

END

SELECT * FROM [chiffon].[dbo].[Products]
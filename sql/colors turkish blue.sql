use [chiffon]

update [chiffon].[dbo].[Colors] set ColorName = 'turkish blue' where ColorName='trkoish blue'

SELECT TOP (1000) [Id]
      ,[ColorName]
      ,[RGB]
  FROM [chiffon].[dbo].[Colors]

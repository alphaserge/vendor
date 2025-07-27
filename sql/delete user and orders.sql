/****** Скрипт для команды SelectTopNRows из среды SSMS  ******/
SELECT TOP (1000) [Id]
      ,[FirstName]
      ,[LastName]
      ,[Email]
      ,[Phones]
      ,[PasswordHash]
      ,[PasswordSalt]
      ,[IsLocked]
      ,[VendorId]
      ,[Created]
      ,[Roles]
      ,[RegistrationHash]
  FROM [chiffon].[dbo].[Users]


  delete FROM [chiffon].[dbo].[OrderItems] where OrderId=1061
  delete FROM [chiffon].[dbo].[Orders] where Id=1061
  delete FROM [chiffon].[dbo].[Users] where Id=57

  alter table [chiffon].[dbo].[OrderItems] drop column [ConfirmByVendor]
  alter table [chiffon].[dbo].[OrderItems] drop column [ShippedByVendor]
  alter table [chiffon].[dbo].[OrderItems] drop column [InStock]
  alter table [chiffon].[dbo].[OrderItems] drop column [ShippedToClient]
  alter table [chiffon].[dbo].[OrderItems] drop column [RecievedByClient]

  alter table [chiffon].[dbo].[OrderItems] add [Shipped]   [datetime] NULL
  alter table [chiffon].[dbo].[OrderItems] add [Delivered] [datetime] NULL

  alter TABLE [dbo].[OrderItems] add DeliveryNo [varchar](30) NULL
  alter TABLE [dbo].[OrderItems] add DeliveryCompany [varchar](50) NULL

  --alter TABLE [dbo].[OrderItems] drop column TrackNo
  


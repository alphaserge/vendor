USE [chiffon]
GO

/****** Object:  Table [dbo].[OrderItems]    Script Date: 25.09.2025 22:01:37 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER TABLE [dbo].[OrderItems] DROP CONSTRAINT [FK_OrderItems_VendorOrders]
GO
drop table VendorOrders
GO

alter table OrderItems drop column VendorQuantity
alter table OrderItems drop column [VendorOrderId]
alter table OrderItems drop column [Paid]
alter table OrderItems drop column [OrderRolls]
alter table OrderItems drop column [VendorOrderId]
GO

alter table OrderItems add [ClientDeliveryNo] [varchar](30) NULL
alter table OrderItems add [ClientDeliveryCompany] [varchar](50) NULL
GO




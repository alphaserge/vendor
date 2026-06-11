USE [chiffon]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

alter TABLE [dbo].[OrderItems] drop constraint FK_OrderItems_FirstDeliveryCompany
alter TABLE [dbo].[OrderItems] drop constraint FK_OrderItems_SecondDeliveryCompany
go

alter TABLE [dbo].[OrderItems] drop column [FirstDeliveryNo]
alter TABLE [dbo].[OrderItems] drop column [FirstDeliveryCompanyId]
alter TABLE [dbo].[OrderItems] drop column [SecondDeliveryNo]
alter TABLE [dbo].[OrderItems] drop column [SecondDeliveryCompanyId]
go

alter TABLE [dbo].[OrderItems] add [VendorDeliveryNo] [varchar](40) NULL
alter TABLE [dbo].[OrderItems] add [VendorDeliveryCompanyId] [int] NULL
alter TABLE [dbo].[OrderItems] add [ClientDeliveryNo] [varchar](40) NULL
alter TABLE [dbo].[OrderItems] add [ClientDeliveryCompanyId] [int] NULL
go

ALTER TABLE [dbo].[OrderItems]  WITH CHECK ADD  CONSTRAINT [FK_OrderItems_VendorDeliveryCompany] FOREIGN KEY([VendorDeliveryCompanyId])
REFERENCES [dbo].[DeliveryCompanies] ([Id])
GO
ALTER TABLE [dbo].[OrderItems] CHECK CONSTRAINT [FK_OrderItems_VendorDeliveryCompany]
GO

ALTER TABLE [dbo].[OrderItems]  WITH CHECK ADD  CONSTRAINT [FK_OrderItems_ClientDeliveryCompany] FOREIGN KEY([ClientDeliveryCompanyId])
REFERENCES [dbo].[DeliveryCompanies] ([Id])
GO
ALTER TABLE [dbo].[OrderItems] CHECK CONSTRAINT [FK_OrderItems_ClientDeliveryCompany]
GO

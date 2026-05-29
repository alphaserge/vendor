USE [chiffon]
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

alter table [dbo].[Products] drop [FK_Products_Vendors]
alter table [dbo].[Products] drop column [VendorId]

alter table [dbo].[ProductDesigns] add [VendorId] [int] NOT NULL

ALTER TABLE [dbo].[ProductDesigns]  WITH CHECK ADD  CONSTRAINT [FK_ProductDesigns_Vendors] FOREIGN KEY([VendorId])
REFERENCES [dbo].[Vendors] ([Id])
GO

ALTER TABLE [dbo].[ProductDesigns] CHECK CONSTRAINT [FK_ProductDesigns_Vendors]
GO

USE [chiffon]
GO

/****** Object:  Table [dbo].[OrderItems]    Script Date: 08.07.2025 18:09:00 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

alter TABLE [dbo].[OrderItems] drop column VendorConfirm
go


alter TABLE [dbo].[OrderItems] add Unit [varchar](20) NULL
go
alter TABLE [dbo].[OrderItems] add ConfirmByVendor [datetime] NULL
go
alter TABLE [dbo].[OrderItems] add ShippedByVendor [datetime] NULL
go
alter TABLE [dbo].[OrderItems] add InStock [datetime] NULL
go
alter TABLE [dbo].[OrderItems] add ShippedToClient [datetime] NULL
go
alter TABLE [dbo].[OrderItems] add RecievedByClient [datetime] NULL
go
alter TABLE [dbo].[OrderItems] add ColorVariantId [int] NULL
go
alter TABLE [dbo].[OrderItems] add [ColorNames] [varchar](50) NULL
go
	
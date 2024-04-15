USE [chiffon]
GO

/****** Object:  Table [dbo].[Products]    Script Date: 01.04.2024 17:15:44 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

insert into [dbo].[Products](
	VendorId,
	[RefNo],
	[ArtNo],
	[ItemName],
	[Design],
	[ColorNo],
	[ColorName],
	[PhotoDir],
	[Price],
	[Weight],
	[Width],
	[ProductStyleId],
	[ProductTypeId]) values (1, '22201','123','WINDSOR JAQUARD PRINT', '2354',1,'RED','/',10,100,100,1,1)

	insert into [dbo].[Products](
	VendorId,
	[RefNo],
	[ArtNo],
	[ItemName],
	[Design],
	[ColorNo],
	[ColorName],
	[PhotoDir],
	[Price],
	[Weight],
	[Width],
	[ProductStyleId],
	[ProductTypeId]) values (2, '22202','524','WINDSOR JAQUARD PRINT', '2354',2,'BLACK','/',12,100,100,2,2)

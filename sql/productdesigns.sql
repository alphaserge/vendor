USE [chiffon]
GO

/****** Object:  Table [dbo].[Products]    Script Date: 01.05.2026 14:23:52 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

alter table Products drop column ColorNo
alter table Products drop column ColorName
alter table Products drop column PhotoDir
alter table Products drop column [FileName]
alter table Products drop column [Findings]
alter table Products drop constraint [FK_Products_PrintType]
alter table Products drop column [PrintTypeId]
alter table Products drop constraint [FK_Products_PlainDyedTypes]
alter table Products drop column [PlainDyedTypeId]
alter table Products drop column [Stock]
alter table Products drop column [VideoUuids]
alter table Products drop column [PhotoUuids]
alter table Products drop column [Price]


USE [chiffon]
GO
alter table [dbo].[Products] add [PhotoUuid] [varchar](40) NULL


CREATE TABLE [dbo].[ProductDesigns](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [int] NULL,
	[Created] [datetime] NOT NULL,
	[RefNo] [varchar](50) NULL,
	[ArtNo] [varchar](50) NULL,
	[Design] [varchar](50) NULL,
	[Price] [decimal](10, 2) NULL,
	[PrintTypeId] [int] NULL,
	[PlainDyedTypeId] [int] NULL,
	[Uuid] [varchar](36) NULL,
	[AllColorsPhotoUuid] [varchar](240) NULL,
	[PhotoUuids] [varchar](240) NULL,
	[VideoUuids] [varchar](100) NULL,
	[SampleNo] [int] NULL,
 CONSTRAINT [PK_productdesigns] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductDesigns] ADD  DEFAULT (getdate()) FOR [Created]
GO

ALTER TABLE [dbo].[ProductDesigns]  WITH CHECK ADD  CONSTRAINT [FK_ProductDesigns_Products] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO

ALTER TABLE [dbo].[ProductDesigns] CHECK CONSTRAINT [FK_ProductDesigns_Products]
GO

ALTER TABLE [dbo].[ProductDesigns]  WITH CHECK ADD  CONSTRAINT [FK_ProductDesigns_PlainDyedTypes] FOREIGN KEY([PlainDyedTypeId])
REFERENCES [dbo].[PlainDyedTypes] ([Id])
GO

ALTER TABLE [dbo].[ProductDesigns] CHECK CONSTRAINT [FK_ProductDesigns_PlainDyedTypes]
GO

ALTER TABLE [dbo].[ProductDesigns]  WITH CHECK ADD  CONSTRAINT [FK_ProductDesigns_PrintType] FOREIGN KEY([PrintTypeId])
REFERENCES [dbo].[PrintTypes] ([Id])
GO

ALTER TABLE [dbo].[ProductDesigns] CHECK CONSTRAINT [FK_ProductDesigns_PrintType]
GO



delete from [dbo].[ColorVariantsInColors]
delete from [dbo].[ColorVariants]

alter TABLE [dbo].[ColorVariants] add [ProductDesignId] [int] NOT NULL
alter TABLE [dbo].[ColorVariants] drop constraint [FK_ColorVariants_Products]
alter TABLE [dbo].[ColorVariants] drop column [ProductId]

ALTER TABLE [dbo].[ColorVariants]  WITH CHECK ADD  CONSTRAINT [FK_ColorVariants_ProductDesigns] FOREIGN KEY([ProductDesignId])
REFERENCES [dbo].[ProductDesigns] ([Id])
GO

ALTER TABLE [dbo].[ColorVariants] CHECK CONSTRAINT [FK_ColorVariants_ProductDesigns]
GO


delete from [dbo].[OrderItems]

alter TABLE [dbo].[OrderItems] add [ProductDesignId] [int] NOT NULL

alter TABLE [dbo].[OrderItems] drop constraint [FK_OrderItems_Products]
alter TABLE [dbo].[OrderItems] drop column [ProductId]

ALTER TABLE [dbo].[OrderItems]  WITH CHECK ADD  CONSTRAINT [FK_OrderItems_ProductDesigns] FOREIGN KEY([ProductDesignId])
REFERENCES [dbo].[ProductDesigns] ([Id])
GO

ALTER TABLE [dbo].[OrderItems] CHECK CONSTRAINT [FK_OrderItems_ProductDesigns]
GO

USE [chiffon]
GO

/****** Object:  Table [dbo].[Products]    Script Date: 18.04.2026 15:01:38 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE TABLE [dbo].[DressGroups](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ParentDressGroupId] [int] NULL,
	[DressGroupName] [varchar](50) NULL,
 CONSTRAINT [PK_DressGroups] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[DressGroups]  WITH CHECK ADD  CONSTRAINT [FK_DressGroup_DressGroup] FOREIGN KEY([ParentDressGroupId])
REFERENCES [dbo].[DressGroups] ([Id])
GO

ALTER TABLE [dbo].[DressGroups] CHECK CONSTRAINT [FK_DressGroup_DressGroup]
GO


CREATE TABLE [dbo].[ProductsInDressGroups](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [int] NOT NULL,
	[DressGroupId] [int] NOT NULL,
 CONSTRAINT [PK_ProductsInDressGroups] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductsInDressGroups]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInDressGroups_DressGroup] FOREIGN KEY([DressGroupId])
REFERENCES [dbo].[DressGroups] ([Id])
GO

ALTER TABLE [dbo].[ProductsInDressGroups] CHECK CONSTRAINT [FK_ProductsInDressGroups_DressGroup]
GO

ALTER TABLE [dbo].[ProductsInDressGroups]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInDressGroups_Products] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO

ALTER TABLE [dbo].[ProductsInDressGroups] CHECK CONSTRAINT [FK_ProductsInDressGroups_Products]
GO



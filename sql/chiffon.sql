USE [chiffon]
GO

/****** Object:  Table [dbo].[products]    Script Date: 24.03.2024 18:45:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Products](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[RefNo] [varchar](50) NULL,
	[ArtNo] [varchar](50) NULL,
	[ItemName] [varchar](100) NULL,
	[Design] [varchar](50) NULL,
	[ColorNo] [int] NULL,
	[ColorName] [varchar](50) NULL,
	[PhotoDir] [varchar](500) NULL,
	[Price1] [decimal](10, 2) NULL,
	[Price2] [decimal](10, 2) NULL,
	[Price3] [decimal](10, 2) NULL,
	[Weight] [int] NULL,
	[Width] [int] NULL,
	[ProductStyleId] [int] NULL,
	[ProductTypeId] [int] NULL,

 CONSTRAINT [PK_products] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[ProductStyles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StyleName] [varchar](50) NULL,
 CONSTRAINT [PK_ProductStyles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[ProductTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TypeName] [varchar](50) NULL,
 CONSTRAINT [PK_ProductTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_ProductStyle] FOREIGN KEY([ProductStyleId])
REFERENCES [dbo].[ProductStyles] ([id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_ProductStyle]
GO

ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_ProductType] FOREIGN KEY([ProductTypeId])
REFERENCES [dbo].[ProductTypes] ([id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_ProductType]
GO


CREATE TABLE [dbo].[DesignTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[DesignName] [varchar](50) NULL,
 CONSTRAINT [PK_Designs] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[ProductsInDesignTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [bigint] NOT NULL,
	[DesignTypeId] [int] NOT NULL,
 CONSTRAINT [PK_ProductsInDesignTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductsInDesignTypes]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInDesignTypes_Products] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[ProductsInDesignTypes] CHECK CONSTRAINT [FK_ProductsInDesignTypes_Products]
GO

ALTER TABLE [dbo].[ProductsInDesignTypes]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInDesignTypes_DesignType] FOREIGN KEY([DesignTypeId])
REFERENCES [dbo].[DesignTypes] ([Id])
GO
ALTER TABLE [dbo].[ProductsInDesignTypes] CHECK CONSTRAINT [FK_ProductsInDesignTypes_DesignType]
GO



CREATE TABLE [dbo].[Colors](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ColorName] [varchar](50) NULL,
 CONSTRAINT [PK_Colors] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[ProductsInColors](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [bigint] NOT NULL,
	[ColorId] [int] NOT NULL,
 CONSTRAINT [PK_ProductInColors] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductsInColors]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInColors_Products] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[ProductsInColors] CHECK CONSTRAINT [FK_ProductsInColors_Products]
GO

ALTER TABLE [dbo].[ProductsInColors]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInColors_Color] FOREIGN KEY([ColorId])
REFERENCES [dbo].[Colors] ([Id])
GO
ALTER TABLE [dbo].[ProductsInColors] CHECK CONSTRAINT [FK_ProductsInColors_Color]
GO


CREATE TABLE [dbo].[OverWorkTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OverWorkName] [varchar](50) NULL,
 CONSTRAINT [PK_OverWorkTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[ProductsInOverWorkTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [bigint] NOT NULL,
	[OverWorkTypeId] [int] NOT NULL,
 CONSTRAINT [PK_ProductInOverWorkTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductsInOverWorkTypes]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInOverWorkTypes_Products] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[ProductsInOverWorkTypes] CHECK CONSTRAINT [FK_ProductsInOverWorkTypes_Products]
GO

ALTER TABLE [dbo].[ProductsInOverWorkTypes]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInOverWorkTypes_OverWorkTypes] FOREIGN KEY([OverWorkTypeId])
REFERENCES [dbo].[OverWorkTypes] ([Id])
GO
ALTER TABLE [dbo].[ProductsInOverWorkTypes] CHECK CONSTRAINT [FK_ProductsInOverWorkTypes_OverWorkTypes]
GO


CREATE TABLE [dbo].[Seasons](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SeasonName] [varchar](50) NULL,
 CONSTRAINT [PK_Seasons] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[ProductsInSeasons](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [bigint] NOT NULL,
	[SeasonId] [int] NOT NULL,
 CONSTRAINT [PK_ProductInSeasons] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductsInSeasons]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInSeasons_Products] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[ProductsInSeasons] CHECK CONSTRAINT [FK_ProductsInSeasons_Products]
GO

ALTER TABLE [dbo].[ProductsInSeasons]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInSeasons_Season] FOREIGN KEY([SeasonId])
REFERENCES [dbo].[Seasons] ([Id])
GO
ALTER TABLE [dbo].[ProductsInSeasons] CHECK CONSTRAINT [FK_ProductsInSeasons_Season]
GO

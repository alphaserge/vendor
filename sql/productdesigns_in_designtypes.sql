USE [chiffon]
GO

/****** Object:  Table [dbo].[ProductsInDesignTypes]    Script Date: 12.05.2026 18:40:11 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

DROP TABLE [dbo].[ProductsInDesignTypes]
GO

CREATE TABLE [dbo].[ProductDesignsInDesignTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductDesignId] [int] NOT NULL,
	[DesignTypeId] [int] NOT NULL,
 CONSTRAINT [PK_ProductDesignsInDesignTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductDesignsInDesignTypes]  WITH CHECK ADD  CONSTRAINT [FK_ProductDesignsInDesignTypes_DesignType] FOREIGN KEY([DesignTypeId])
REFERENCES [dbo].[DesignTypes] ([Id])
GO

ALTER TABLE [dbo].[ProductDesignsInDesignTypes] CHECK CONSTRAINT [FK_ProductDesignsInDesignTypes_DesignType]
GO

ALTER TABLE [dbo].[ProductDesignsInDesignTypes]  WITH CHECK ADD  CONSTRAINT [FK_ProductDesignsInDesignTypes_ProductDesigns] FOREIGN KEY([ProductDesignId])
REFERENCES [dbo].[ProductDesigns] ([Id])
GO

ALTER TABLE [dbo].[ProductDesignsInDesignTypes] CHECK CONSTRAINT [FK_ProductDesignsInDesignTypes_ProductDesigns]
GO



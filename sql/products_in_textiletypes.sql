USE [chiffon]
GO

/****** Object:  Table [dbo].[Colors]    Script Date: 05.09.2024 10:15:33 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ProductsInTextileTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [int] NOT NULL,
	[TextileTypeId] [int] NOT NULL,
	[Value] [int] NOT NULL,
 CONSTRAINT [PK_ProductsInTextileTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductsInTextileTypes]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInTextileTypes_Products] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO

ALTER TABLE [dbo].[ProductsInTextileTypes] CHECK CONSTRAINT [FK_ProductsInTextileTypes_Products]
GO

ALTER TABLE [dbo].[ProductsInTextileTypes]  WITH CHECK ADD  CONSTRAINT [FK_ProductsInTextileTypes_TextileTypes] FOREIGN KEY([TextileTypeId])
REFERENCES [dbo].[TextileTypes] ([Id])
GO

ALTER TABLE [dbo].[ProductsInTextileTypes] CHECK CONSTRAINT [FK_ProductsInTextileTypes_TextileTypes]
GO




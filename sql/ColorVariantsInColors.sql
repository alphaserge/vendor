USE [chiffon]
GO

/****** Object:  Table [dbo].[ProductsInColors]    Script Date: 08.05.2024 22:17:36 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

drop TABLE [dbo].[ColorVariantsInColors]
go

CREATE TABLE [dbo].[ColorVariantsInColors](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ColorVariantId] [int] NOT NULL,
	[ColorId] [int] NOT NULL,
 CONSTRAINT [PK_ColorVariantsInColors] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ColorVariantsInColors]  WITH CHECK ADD  CONSTRAINT [FK_ColorVariantsInColors_Color] FOREIGN KEY([ColorId])
REFERENCES [dbo].[Colors] ([Id])
GO

ALTER TABLE [dbo].[ColorVariantsInColors] CHECK CONSTRAINT [FK_ColorVariantsInColors_Color]
GO

ALTER TABLE [dbo].[ColorVariantsInColors]  WITH CHECK ADD  CONSTRAINT [FK_ColorVariantsInColors_ColorVariants] FOREIGN KEY([ColorVariantId])
REFERENCES [dbo].[ColorVariants] ([Id])
GO

ALTER TABLE [dbo].[ColorVariantsInColors] CHECK CONSTRAINT [FK_ColorVariantsInColors_ColorVariants]
GO



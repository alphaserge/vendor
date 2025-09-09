USE [chiffon]
GO

/****** Object:  Table [dbo].[Seasons]    Script Date: 09.09.2025 21:31:58 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Stocks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StockName] [varchar](50) NULL,
 CONSTRAINT [PK_Stocks] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

alter table [dbo].[OrderItems] add [StockId] [int] NULL
GO

ALTER TABLE [dbo].[OrderItems]  WITH CHECK ADD CONSTRAINT [FK_OrderItems_Stocks] FOREIGN KEY([StockId])
REFERENCES [dbo].[Stocks] ([Id])
GO

ALTER TABLE [dbo].[OrderItems] CHECK CONSTRAINT [FK_OrderItems_Stocks]
GO

INSERT INTO Stocks (StockName) VALUES ('Moscow')
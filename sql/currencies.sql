USE [chiffon]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Currencies](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CurrencyName] [nvarchar](20) NOT NULL,
	[ShortName] [nvarchar](3) NOT NULL,
	[Rate] [decimal](10, 4) NULL,
 CONSTRAINT [PK_Currencies] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


insert into [dbo].[Currencies]([CurrencyName], [ShortName], [Rate]) values ('Доллар США', 'USD', 1)
insert into [dbo].[Currencies]([CurrencyName], [ShortName], [Rate]) values ('Российский рубль', 'RUR', 82)
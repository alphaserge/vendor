USE [chiffon]
GO

/****** Object:  Table [dbo].[Payments]    Script Date: 30.09.2025 17:31:08 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

delete from [dbo].[Payments]

alter TABLE [dbo].[Payments] add CurrencyAmount [decimal](10, 2) NOT NULL

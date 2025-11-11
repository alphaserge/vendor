USE [chiffon]
GO

/****** Object:  Table [dbo].[Payments]    Script Date: 11.11.2025 13:37:15 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

delete from [dbo].[Payments]

alter TABLE [dbo].[Payments] add [ExchangeRate] [decimal](10, 2) NOT NULL


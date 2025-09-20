USE [chiffon]
GO

/****** Object:  Table [dbo].[Payments]    Script Date: 20.09.2025 11:40:08 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

delete from [dbo].[Payments]
go

alter TABLE [dbo].[Payments] drop column What
alter TABLE [dbo].[Payments] drop column WhatId
alter TABLE [dbo].[Payments] drop column Currency

alter TABLE [dbo].[Payments] add [CurrencyId] [int] not NULL

ALTER TABLE [dbo].[Payments]  WITH CHECK ADD  CONSTRAINT [FK_Payments_Currencies] FOREIGN KEY([CurrencyId])
REFERENCES [dbo].[Currencies] ([Id])
GO

ALTER TABLE [dbo].[Payments] CHECK CONSTRAINT [FK_Payments_Currencies]
GO



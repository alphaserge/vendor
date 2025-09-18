USE [chiffon]
GO

/****** Object:  Table [dbo].[OrderItems]    Script Date: 18.09.2025 14:28:56 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

alter TABLE [dbo].[Payments] add [OrderId] [int] NULL
	
ALTER TABLE [dbo].[Payments]  WITH CHECK ADD  CONSTRAINT [FK_Payments_Orders] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO

ALTER TABLE [dbo].[Payments] CHECK CONSTRAINT [FK_Payments_Orders]
GO

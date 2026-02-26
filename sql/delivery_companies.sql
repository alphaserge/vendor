USE [chiffon]
GO

/****** Object:  Table [dbo].[Vendors]    Script Date: 26.02.2026 17:55:00 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[DeliveryCompanies](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CompanyName] [varchar](50) NULL,
	[Contacts] [varchar](200) NULL,
	[Email] [varchar](100) NULL,
	[Phone] [varchar](100) NULL,
 CONSTRAINT [PK_DeliveryCompanies] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


ALTER TABLE [dbo].[OrderItems] DROP COLUMN [DeliveryNo]
ALTER TABLE [dbo].[OrderItems] DROP COLUMN [DeliveryCompany]
ALTER TABLE [dbo].[OrderItems] DROP COLUMN [ClientDeliveryNo]
ALTER TABLE [dbo].[OrderItems] DROP COLUMN [ClientDeliveryCompany]
GO

ALTER TABLE [dbo].[OrderItems] add [FirstDeliveryNo] [varchar](40) NULL
ALTER TABLE [dbo].[OrderItems] add [FirstDeliveryCompanyId] [int] NULL
ALTER TABLE [dbo].[OrderItems] add [SecondDeliveryNo] [varchar](40) NULL
ALTER TABLE [dbo].[OrderItems] add [SecondDeliveryCompanyId] [int] NULL
GO


ALTER TABLE [dbo].[OrderItems]  WITH CHECK ADD CONSTRAINT [FK_OrderItems_FirstDeliveryCompany] FOREIGN KEY([FirstDeliveryCompanyId])
REFERENCES [dbo].[DeliveryCompanies] ([Id])
GO

ALTER TABLE [dbo].[OrderItems] CHECK CONSTRAINT [FK_OrderItems_FirstDeliveryCompany]
GO

ALTER TABLE [dbo].[OrderItems]  WITH CHECK ADD CONSTRAINT [FK_OrderItems_SecondDeliveryCompany] FOREIGN KEY([SecondDeliveryCompanyId])
REFERENCES [dbo].[DeliveryCompanies] ([Id])
GO

ALTER TABLE [dbo].[OrderItems] CHECK CONSTRAINT [FK_OrderItems_SecondDeliveryCompany]
GO



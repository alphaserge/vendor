USE [chiffon]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE TABLE [dbo].[Vendors](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[VendorName] [varchar](50) NULL,
	[Contacts] [varchar](200) NULL,
	[VendorType] [varchar](20) NOT NULL,
 CONSTRAINT [PK_Vendors] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Vendors] ADD  DEFAULT ('vendor') FOR [VendorType]
GO

alter table [dbo].[Products] add [VendorId] [int] NOT NULL

ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_Vendors] FOREIGN KEY([VendorId])
REFERENCES [dbo].[Vendors] ([Id])
GO

ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_Vendors]
GO

delete from Vendors

DBCC CHECKIDENT ('[Vendors]', RESEED, 0);
GO
--SET IDENTITY_INSERT dbo.Vendors ON;  
--GO  
insert into Vendors(VendorName, Contacts, VendorType) values ('Angelika Moscow', '{phones: [{"mobile": "89167220074"}]}', 'owner')
insert into Vendors(VendorName, Contacts, VendorType) values ('VENDOR 1', '{phones: [{"mobile": "89167220074"}]}', 'vendor')
insert into Vendors(VendorName, Contacts, VendorType) values ('VENDOR 2', '{phones: [{"mobile": "89167220074"}]}', 'vendor')
GO
--SET IDENTITY_INSERT dbo.Vendors OFF;  
--GO  

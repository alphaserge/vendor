USE [chiffon]
GO

/****** Object:  Table [dbo].[Seasons]    Script Date: 07.08.2024 21:05:26 ******/

/*
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Finishings](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FinishingName] [varchar](50) NULL,
 CONSTRAINT [PK_Finishing] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


insert into [Finishings]([FinishingName]) values ('ROUGH')
insert into [Finishings]([FinishingName]) values ('SOFT')
insert into [Finishings]([FinishingName]) values ('PEACH')
insert into [Finishings]([FinishingName]) values ('BRUSH')
insert into [Finishings]([FinishingName]) values ('CREPE') */


alter table Products add [FinishingId] [int] NULL


ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_Finishing] FOREIGN KEY([FinishingId])
REFERENCES [dbo].[Finishings] ([Id])
GO

ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_Finishing]
GO

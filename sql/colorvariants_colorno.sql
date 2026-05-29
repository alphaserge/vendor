USE [chiffon]
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

alter TABLE [dbo].[ColorVariants] drop column [Num]

alter TABLE [dbo].[ColorVariants] add [ColorNo] [varchar](36) NULL

alter TABLE [dbo].[ColorVariants] drop column [Uuid]

alter TABLE [dbo].[ColorVariants] add [Uuid] [varchar](36) NOT NULL

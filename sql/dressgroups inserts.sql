USE [chiffon]
GO

SET IDENTITY_INSERT [dbo].[DressGroups] ON
GO

INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (1, null, 'Casual Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (2, null, 'Costume Wear / Formal Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (3, null, 'SportsWear / ActiveWear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (4, null, 'WorkWear / Uniforms')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (5, null, 'SleepWear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (6, null, 'OuterWear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (7, null, 'Ethnic Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (8, null, 'InnerWear / Lingerie')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (9, null, 'Kids Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (10, null, 'Special Occasion Wear / Party Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (11, null, 'Sundries  / Other')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (12, 1, 'T-Shirts')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (13, 1, 'Shirts')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (14, 1, 'Jeans')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (15, 1, 'Trousers')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (16, 1, 'Dress')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (17, 1, 'Tops')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (18, 1, 'Tunics')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (19, 1, 'Kurtis')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (20, 1, 'Blouses')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (21, 1, 'Polo Shirt')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (22, 1, 'SweatShirts')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (23, 1, 'Sweater')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (24, 1, 'Turtlenecks')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (25, 1, 'Sundress')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (26, 1, 'Ñardigans')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (27, 1, 'Everyday Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (28, 2, 'Suits')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (29, 2, 'Blazer')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (30, 2, 'Gowns')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (31, 2, 'Office Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (32, 2, 'Formal Dresses')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (33, 3, 'Tracksuits')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (34, 3, 'Leggings')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (35, 3, 'Gym Tops')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (36, 3, 'Shorts')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (37, 3, 'SwimWear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (38, 3, 'BeachWear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (39, 4, 'Office Uniforms')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (40, 4, 'School Uniforms')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (41, 4, 'Industrial Clothes')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (42, 4, 'Protective Clothes')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (43, 4, 'Medical Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (44, 5, 'Pyjamas')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (45, 5, 'Nightgowns')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (46, 5, 'Robes')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (47, 6, 'Jackets')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (48, 6, 'Coats')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (49, 6, 'Rain Coats')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (50, 6, 'Parkas')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (51, 6, 'OverCoat (Palto)')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (52, 7, 'Saeres')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (53, 7, 'Salwar Suits')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (54, 7, 'Kurtis')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (55, 7, 'Traditional Dress')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (56, 8, 'Underwear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (57, 8, 'Bras')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (58, 8, 'Briefs')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (59, 8, 'Undershirts')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (60, 8, 'Linning')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (61, 9, 'Baby Clothes')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (62, 9, 'Childrens Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (63, 9, 'School Uniforms')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (64, 10, 'Wedding Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (65, 10, 'Party Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (66, 10, 'Ceremonial Clothes')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (67, 10, 'Finishing - Decorative')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (68, 10, 'Decorative')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (69, 10, 'Concert Wear')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (70, 11, 'Bags')
INSERT INTO [dbo].[DressGroups]( [Id], [ParentDressGroupId], [DressGroupName] ) VALUES (71, 11, 'Hats')

 DBCC CHECKIDENT ('[dbo].[DressGroups]', RESEED, 71);

GO












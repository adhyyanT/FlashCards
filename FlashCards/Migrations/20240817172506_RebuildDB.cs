using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace FlashCards.Api.Migrations
{
    /// <inheritdoc />
    public partial class RebuildDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AppUsers",
                columns: table => new
                {
                    AppUserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    LastName = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Password = table.Column<byte[]>(type: "longblob", nullable: false),
                    Salt = table.Column<byte[]>(type: "longblob", nullable: false),
                    Email = table.Column<string>(type: "varchar(255)", nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    Age = table.Column<int>(type: "int", nullable: false),
                    Avatar = table.Column<string>(type: "longtext", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUsers", x => x.AppUserId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "WordPacks",
                columns: table => new
                {
                    WordPackId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsPublic = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AppUserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WordPacks", x => x.WordPackId);
                    table.ForeignKey(
                        name: "FK_WordPacks_AppUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AppUsers",
                        principalColumn: "AppUserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "WordPackDetails",
                columns: table => new
                {
                    WordId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Word = table.Column<string>(type: "longtext", nullable: false),
                    Meaning = table.Column<string>(type: "longtext", nullable: false),
                    Image = table.Column<string>(type: "longtext", nullable: false),
                    Proficiency = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    WordPackId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WordPackDetails", x => x.WordId);
                    table.ForeignKey(
                        name: "FK_WordPackDetails_WordPacks_WordPackId",
                        column: x => x.WordPackId,
                        principalTable: "WordPacks",
                        principalColumn: "WordPackId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_Email",
                table: "AppUsers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WordPackDetails_WordPackId",
                table: "WordPackDetails",
                column: "WordPackId");

            migrationBuilder.CreateIndex(
                name: "IX_WordPacks_AppUserId",
                table: "WordPacks",
                column: "AppUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WordPackDetails");

            migrationBuilder.DropTable(
                name: "WordPacks");

            migrationBuilder.DropTable(
                name: "AppUsers");
        }
    }
}

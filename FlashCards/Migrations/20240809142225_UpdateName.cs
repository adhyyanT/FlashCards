using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlashCards.Migrations
{
    /// <inheritdoc />
    public partial class UpdateName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WordPacks_AppUsers_AppUserEmail",
                table: "WordPacks");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "WordPacks");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserEmail",
                table: "WordPacks",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_WordPacks_AppUsers_AppUserEmail",
                table: "WordPacks",
                column: "AppUserEmail",
                principalTable: "AppUsers",
                principalColumn: "Email",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WordPacks_AppUsers_AppUserEmail",
                table: "WordPacks");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserEmail",
                table: "WordPacks",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "WordPacks",
                type: "longtext",
                nullable: false);

            migrationBuilder.AddForeignKey(
                name: "FK_WordPacks_AppUsers_AppUserEmail",
                table: "WordPacks",
                column: "AppUserEmail",
                principalTable: "AppUsers",
                principalColumn: "Email");
        }
    }
}

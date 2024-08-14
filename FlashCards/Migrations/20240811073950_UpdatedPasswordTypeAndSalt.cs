using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlashCards.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedPasswordTypeAndSalt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "Password",
                table: "AppUsers",
                type: "longblob",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AddColumn<byte[]>(
                name: "Salt",
                table: "AppUsers",
                type: "longblob",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Salt",
                table: "AppUsers");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "AppUsers",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "longblob");
        }
    }
}

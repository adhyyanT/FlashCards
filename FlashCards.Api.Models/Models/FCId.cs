using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlashCards.Models.Models
{
    public class FCId
    {
        public int Id { get; set; }

        public FCId() { }

        public FCId(int id)
        {
            Id = id;
        }
    }
}

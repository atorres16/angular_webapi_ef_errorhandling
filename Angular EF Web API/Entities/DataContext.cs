using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Angular_EF_Web_API.Entities
{
    public class DataContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }
    }
}
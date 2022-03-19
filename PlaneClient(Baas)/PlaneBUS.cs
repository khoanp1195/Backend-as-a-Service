using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FireSharp;
using FireSharp.Config;
using FireSharp.Interfaces;
using FireSharp.Response;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PlaneClient_Baas_
{
    class PlaneBUS
    {
        static IFirebaseConfig config = new FirebaseConfig
        {
            BasePath = "https://ktpm-156ad-default-rtdb.asia-southeast1.firebasedatabase.app/"
        };
        static FirebaseClient client = new FirebaseClient(config);


        public bool AddNew(Plane newPlane)
        {

            try
            {
                //    client. Push ("planes", newPlane); // auto -generated key
                client.Set("planes/P" + newPlane.Id, newPlane); // custom key
                return true;
            }
            catch { return false; }

        }

        private void UpdateDataGridView(DataGridView gvPlane)
        {
            List<Plane> planes = GetAll();
            gvPlane.BeginInvoke(new MethodInvoker(delegate
            {
                gvPlane.DataSource = planes;
            })); // set asynchronous datasource

        }
        public async void ListenFirebase(DataGridView gvPlane)
        {
            EventStreamResponse response = await client.OnAsync("planes",
               added: (sender, args, context) => { UpdateDataGridView(gvPlane); },
               changed: (sender, args, context) => { UpdateDataGridView(gvPlane); },
               removed: (sender, args, context) => { UpdateDataGridView(gvPlane); }
          );

        }
        public List<Plane> GetAll()
        {
            FirebaseResponse response = client.Get("planes");
            Dictionary<String, Plane> dictBooks = response.ResultAs<Dictionary<String, Plane>>();
            return dictBooks.Values.ToList();
        }
        public Plane GetDetails(int Id)
        {
            FirebaseResponse response = client.Get("planes/P" + Id);
            Plane plane = response.ResultAs<Plane>();

            return plane;

        }

        private String GetKeyByCode(int Id)
        {
            FirebaseResponse response = client.Get("planes");
            Dictionary<String, Plane> dictPlanes = response.ResultAs<Dictionary<String, Plane>>();
            String key = dictPlanes.FirstOrDefault(x => x.Value.Id == Id).Key;
            return key;


        }

        public List<Plane> Search(String keyword)
        {
            List<Plane> planes = new List<Plane>();
            foreach (var item in GetAll()) {
                if (item.Name.ToLower().Contains(keyword.ToLower()))
                {
                    planes.Add(item);
                }

            }
            return planes;

        }


        public bool Update(Plane newPlane)
        {
            try
            {
                String key = GetKeyByCode(newPlane.Id);
                if (String.IsNullOrEmpty(key))
                    return false;
                client.Set("planes/" + key, newPlane);

                return true;


            }
            catch { return false; }
            }


        public bool Delete(int Id)
        {
            try
            {
                String key = GetKeyByCode(Id);
                if (String.IsNullOrEmpty(key)) return false;
                client.Delete("planes/" + key);
           
                return true;
            }
            catch { return false; }
        }
    }
}

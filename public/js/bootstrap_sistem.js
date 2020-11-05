// USER
$("#Msk27saj20vSosk2ivmW").submit(function(event) {
  event.preventDefault();               
  swal({
    title: "Apakah Kamu Yakin ?",
    text: "Semua Data Akun Anda Akan Kami Hapus",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((blokirs) => {
    if (blokirs) {
      var data    = $('#Msk27saj20vSosk2ivmW').serialize();                  
      $.ajax({
          type: "POST",
          data: data,
          url: "/admin/login",
          success: function(toni) {
            if (toni.info.status == 0) {
              swal(toni.info.intro,toni.info.pesan,toni.info.type)                    
            } else {          
              window.location.assign("/"); 
            }
          }
      });
    } else {
      swal("Dibatalkan");
    }
  });     
});




// ADMIN
$("#admin-login").submit(function(event) {
    event.preventDefault();
    var data    = $('#admin-login').serialize();                 
    $.ajax({
        type: "POST",
        data: data,
        url: "/admin/login",
        success: function(toni) {
          if (toni.info.status == 0) {
            swal(toni.info.intro,toni.info.pesan,toni.info.type)                    
          }          
          else {                                    
            setTimeout(function(){
              window.location.assign("/admin/index");                
            },1000)              
          }
        }
    });
});

function hapusBarang(ev) {
  ev.preventDefault();
  var url = ev.currentTarget.getAttribute('href'); 
  swal({
    title: "Perhatian",
    text: "Data ini akan dihapus dari database",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {    
    if (willDelete) {
      swal("Data Berhasil di hapus", {
        icon: "success"      
      });
      setTimeout(function(){
        window.location.assign(url);                
      },1000)   
    } else {
      swal("dibatalkan");
    }
  });
  }

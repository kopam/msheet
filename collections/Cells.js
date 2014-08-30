Cells = new Meteor.Collection("cells");

//initialize the db
//if (Cells.find({}).count() === 0){ 
//  for(var i = 1; i <= 32; i++){
//    for(var j = 1; j <= 32; j++){
//      var c = {
//        row : i,
//        col : j,
//        val : ''
//      };
//      Cells.insert(c);
//    }
//  }
//}
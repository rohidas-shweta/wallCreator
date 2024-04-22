# wallCreator



Steps to create a wall 
1. Select the "create_points" checkbox from the menu and plot two points on the canvas. This will create a wall that looks like a pipe from the top view.
2. Now Uncheck the "create_points" checkbox from the menu so plotting point functionality will get disabled and move the camera using the mouse to see the 3D view of the wall created.  


View from the front.
![first_top_view](https://github.com/rohidas-shweta/wallCreator/assets/167707503/492842b5-bccd-4a6b-95c6-fae97066f825)


3D view
![3d_view](https://github.com/rohidas-shweta/wallCreator/assets/167707503/40197bd9-7a79-47df-a9dd-7ed2de649187)

4. To get the top view again you can check the setView checkbox from the menu.
5. To insert the walls again select the create_points checkbox and plot the points to create the wall.


6.  After the wall is created the API in the backend will get called that will insert the wall dimensions (width, height, depth) in the database table.


#!/bin/bash
rsync -ru sideload-apps.json root@ioshaven.co:/code/packages/resource
rsync -ru uploads/images/* root@ioshaven.co:/code/uploads/images/
rsync -ru uploads/ipas/* root@ioshaven.co:/code/uploads/ipas/
echo "yes"

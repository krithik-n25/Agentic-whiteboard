"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';

function ProjectList() {

  const [ProjectList, setProjectList] = useState([]);

  return (
    <div>
      {ProjectList.length === 0 ? (
        <div className='flex flex-col items-center p-10 gap-4 mt-8 border-2 rounded-xl p-10'>
          <Image src="/image.png" alt="Folder Image" width={50} height={50} />
          <div className='text-center'>
            <h1 className='text-2xl font-bold'>No Board Found</h1>
            <p className='text-muted-foreground mb-2'>Create Your First board, start planning!</p>
            <Button>+ Create Project</Button>
          </div>
        </div>
      ) :
        <div>
          {/* {Project List}</div>} */}
        </div>
      }
    </div>
  )
}

export default ProjectList
export type UserType={
    Username?:string;
    Firstname?:string;
    Lastname?:string;
    Role?:string;
    CreatedAt:Date;
    _id:string;
    Email:string;
}

export default function UserItem({user}:{user:UserType}) {
  return (
    <div
    className='flex rounded-md italic hover:shadow-blue-500 hover:cursor-pointer justify-between px-2 shadow'>
        <span className=" text-center">{user.Username}</span>
        <h3 className="text-center">{user.Role}</h3>
    </div>
  )
}

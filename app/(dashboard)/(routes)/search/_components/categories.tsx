import { Category } from "@prisma/client"
import {IconType} from 'react-icons'
import {FcMusic} from 'react-icons/fc'
import CategoryItem from "./category-item";
type CategoriesProps = {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Music": FcMusic,
}

const Categories = async ({items}: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item) => (
            <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id}/>
        ))}
    </div>
  )
}

export default Categories
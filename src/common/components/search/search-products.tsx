// import { formatMoney } from '@i18n/format';
// import { Avatar, AvatarImage } from '@reui/ui/avatar';
// import { Badge } from '@reui/ui/badge';
// import { List, ListItem } from '@reui/ui/list';
// // import {
// //   EcommerceProduct,
// // } from '@/app/src/models/ecommerce';
// import { comingSoonToast } from '../common/coming-soon-toast';
// import { useSearch } from './search-context';

export default function SearchProducts() {
//   // const { data } = useSearch();
//   // const products = data?.products || [];

//   return (
//     <List>
//       {products.map((product: EcommerceProduct) => {

//         return (
//           <ListItem value={product.id} key={product.id} asChild>
//             <div
//               key={product.id}
//               onClick={comingSoonToast}
//               className="flex grow items-center justify-between text-sm rounded-lg hover:bg-accent/50 cursor-pointer p-2 gap-1 group"
//             >
//               <div className="inline-flex items-center gap-2.5">
//                 <Avatar className="size-8">
//                   {product.thumbnail && (
//                     <AvatarImage
//                       className="border border-border rounded-lg"
//                       src={product.thumbnail}
//                       alt={product.name}
//                     />
//                   )}
//                 </Avatar>
//                 <span className="font-medium w-[175px] truncate">
//                   {product.name}
//                 </span>
//                 <Badge
//                   className="hidden group-hover:inline-flex"
//                   variant="info"
//                   appearance="outline"
//                 >
//                   {product.sku}
//                 </Badge>
//               </div>

//               <div className="inline-flex items-center gap-5">
//                 <div className="font-semibold shrink-0 w-20">
//                   {formatMoney(product.price)}
//                 </div>
//                 <div className="shrink-0 w-28">
                  
//                 </div>
//               </div>
//             </div>
//           </ListItem>
//         );
//       })}
//     </List>
//   );
}

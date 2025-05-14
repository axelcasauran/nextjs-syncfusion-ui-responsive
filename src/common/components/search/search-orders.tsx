// import { formatMoney } from '@i18n/format';
// import { getInitials } from '@lib/utils';
// import { Avatar, AvatarFallback, AvatarImage } from '@reui/ui/avatar';
// import { Badge } from '@reui/ui/badge';
// import { List, ListItem } from '@reui/ui/list';
// // import {
// //   EcommerceOrder,
// // } from '@/app/src/models/ecommerce';
// import { comingSoonToast } from '../common/coming-soon-toast';
// import { useSearch } from './search-context';

// export default function SearchOrders() {
//   const { data } = useSearch();
//   const orders = data?.orders || [];

//   return (
//     <List>
//       {orders.map((order: EcommerceOrder) => {

//         return (
//           <ListItem value={order.id} key={order.id} asChild>
//             <div
//               onClick={comingSoonToast}
//               className="group flex grow items-center justify-between text-sm rounded-lg outline-hidden focus:bg-accent/50 hover:bg-accent/50 cursor-pointer p-2 gap-1"
//             >
//               <div className="inline-flex items-center gap-2.5">
//                 <div className="inline-flex items-center gap-2.5 w-[200px] truncate">
//                   <Avatar className="h-6 w-6">
//                     {order.user?.avatar && (
//                       <AvatarImage src={order.user.avatar} alt="" />
//                     )}
//                     <AvatarFallback className="text-xs group-hover:bg-background">
//                       {getInitials(order.user?.firstName || order.user?.email, 1)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span>{order.user?.firstName || order.user?.email}</span>
//                 </div>
//                 <Badge
//                   className="hidden group-hover:inline-flex gap-1"
                  
//                   appearance="outline"
//                 >
//                   <span className="opacity-80">Payment:</span>
                  
//                 </Badge>
//               </div>
//               <div className="inline-flex items-center gap-5">
//                 <div className="font-semibold shrink-0 w-20">
//                   {formatMoney(order.totalAmount)}
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
// }

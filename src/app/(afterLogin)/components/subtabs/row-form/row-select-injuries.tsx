// import React from 'react';
// import { Button } from '@/components/ui/button';
// import SelectInjuries from '@/app/(afterSignIn)/components/subtabs/row-form/select-injury/select-injuries';
//
// export interface AccidentSymptomsType {
//   area: string;
//   area_label: string;
//   diagnosis: string;
//   estimate_future_medical_days: number;
//   is_serious: boolean;
//   label: string;
//   level: number;
//   more_question?: string;
// }
//
// interface RowSelectInjuriesProps {
//   injuries: AccidentSymptomsType[];
//   setInjuries: React.Dispatch<React.SetStateAction<AccidentSymptomsType[]>>;
// }
//
// const RowSelectInjuries: React.FC<RowSelectInjuriesProps> = ({ injuries, setInjuries }) => {
//   const defaultData = {
//     area: '',
//     area_label: '',
//     diagnosis: '',
//     estimate_future_medical_days: 0,
//     is_serious: false,
//     label: '',
//     level: 0,
//     more_question: '',
//   };
//   const onRemove = (index: number) => {
//     setInjuries((prev) => prev.filter((item: AccidentSymptomsType, i: number) => i !== index));
//   };
//   return (
//     <div className="w-full h-fit border-b border-gray-200 pb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4">
//       <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">부상</p>
//       <div className="font-14-bold text-gray-900 space-x-2 flex justify-center flex-col w-full">
//         <div className="w-full h-full flex flex-col items-center py-2 space-y-4">
//           {injuries.length > 0 &&
//             injuries.map((injury: AccidentSymptomsType, index: number) => (
//               <div key={index} className="w-full flex justify-end items-start space-x-2">
//                 <SelectInjuries injury={injury} setInjuries={setInjuries} index={index} />
//                 <Button
//                   variant="destructive"
//                   size="default"
//                   className="whitespace-nowrap cursor-pointer"
//                   onClick={() => onRemove(index)}
//                 >
//                   삭제
//                 </Button>
//               </div>
//             ))}
//         </div>
//         <Button
//           variant="outline"
//           size="lg"
//           className="w-full"
//           onClick={() => {
//             setInjuries([...injuries, defaultData]);
//           }}
//         >
//           부상 추가
//         </Button>
//       </div>
//     </div>
//   );
// };
//
// export default RowSelectInjuries;

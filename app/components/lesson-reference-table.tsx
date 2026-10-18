import type {ReferenceTable} from '@/lib/knowledge';

type SourceLink = {id:string;title:string;url:string};

/** One semantic table; the same rows become labelled cards on narrow screens. */
export function LessonReferenceTable({table,sources}:{table:ReferenceTable;sources:SourceLink[]}) {
  return (
    <div className="lesson-reference" id={table.id}>
      <p className="caption reference-verification">現行仕様の確認日：{table.lastVerifiedAt}</p>
      <table className="lesson-reference-table" role="table">
        <caption>{table.caption}</caption>
        <thead role="rowgroup">
          <tr role="row">{table.columns.map(column=><th scope="col" role="columnheader" key={column}>{column}</th>)}</tr>
        </thead>
        <tbody role="rowgroup">
          {table.rows.map(row=>(
            <tr role="row" key={row.id} data-reference-row={row.id}>
              <th scope="row" role="rowheader">{row.cells[0]}</th>
              {row.cells.slice(1).map((cell,index)=>(
                <td role="cell" key={table.columns[index+1]}>
                  <span className="reference-cell-label" aria-hidden="true">{table.columns[index+1]}</span>
                  <span className="reference-cell-text">{cell}</span>
                  {index===row.cells.length-2&&<>
                    {row.example&&<p className="reference-example"><strong>例：</strong>{row.example}</p>}
                    <div className="reference-row-sources" aria-label={`${row.cells[0]}の公式出典`}>
                      {row.sourceIds.map((id,i)=>{
                        const source=sources.find(item=>item.id===id);
                        return source?<a key={id} href={source.url} target="_blank" rel="noreferrer" aria-label={`${row.cells[0]}：${source.title}（新しいタブで開く）`}>公式{i+1} ↗</a>:null;
                      })}
                    </div>
                  </>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

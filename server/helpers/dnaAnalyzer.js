const dnaAnalyzerObject =  {

    getFirstDiagonal(matrix) {

        let i    = 0,
            key = '',
            diag = '';
    
        matrix.forEach(row => {
            key = row.substring(i, (i + 1));
            i++;
            diag = diag + key;
        });
    
        return diag;
     },
     getSecondDiagonal(matrix) {

        let i    = matrix.length,
            key = '',
            diag = '';
    
        matrix.forEach(row => {
            key = row.substring(i, (i - 1));
            i--;
            diag = diag + key;
        });
    
        return diag;
     },
     getHorizontalRows (matrinx) {

        let r               = 0,
            horizontalRows  = [];
    
        matrinx.forEach(row => {
            horizontalRows[r] = [];
            horizontalRows[r].push(row);
            r++;
        });
    
        return horizontalRows;
     },
     getVerticalRows (matrix) {

        let c            = 0,
            verticalRows = [],
            l;
    
        for (l = 0; l < matrix.length; l++) {
        
            let column = '';
            matrix.forEach(row => {
                column = column + row[l];
            });
        
            verticalRows[c] = [];
            verticalRows[c].push(column);
            c++;
        }
    
        return verticalRows;
    },
    getPoolOfSecuences(matrix) {

        let poolOfRows = [],
            firstDiagonal,
            secondDiagonal,
            horizontalRows,
            verticalRows;
    
        firstDiagonal  = this.getFirstDiagonal(matrix);
        secondDiagonal = this.getSecondDiagonal(matrix);

        poolOfRows.push(firstDiagonal);
        poolOfRows.push(secondDiagonal);

        horizontalRows = this.getHorizontalRows(matrix);
    
        horizontalRows.forEach(hrow => {
            hrow.forEach(hr => {
                poolOfRows.push(hr);
            })
        });
    
        verticalRows = this.getVerticalRows(matrix);
    
        verticalRows.forEach(vrow => {
            vrow.forEach(vr => {
                poolOfRows.push(vr);
            })
        });
    
        return poolOfRows;
    },
    secuenceAnalyzer(row) {
        var res = row.replace(/(.)\1*/g, function(secuence, $1) {
            return  (secuence.length > 3 ) ? 'mutantSequence' : 'humanSequence';
        });
    
        return  res;
    },
    isMutant(matrix) {

        let sequenceCounter = 0,
            poolOfRows;
        
        poolOfRows = this.getPoolOfSecuences(matrix);
    
        poolOfRows.forEach(row => {
            let res = this.secuenceAnalyzer(row);
                if (res.indexOf('mutantSequence') !== -1) {
                sequenceCounter++;
            }
        });
    
        return (sequenceCounter > 1);
    }
}

module.exports = dnaAnalyzerObject;

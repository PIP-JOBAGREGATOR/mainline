/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package resumeanalize;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.Statement;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Random;
import java.util.Scanner;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.jsoup.Jsoup;

public class Resume {

    Connection dbcon;
    private Hashtable<String, Integer> domenii = new Hashtable<String, Integer>();
    private Hashtable<String, Integer> meserii = new Hashtable<String, Integer>();
    private Hashtable<String, Integer> nrDomenii = new Hashtable<String, Integer>();
    private Hashtable<String, Integer> nrMeserii = new Hashtable<String, Integer>();

    void init()
    {
        try
       {

           Class.forName ("com.mysql.jdbc.Driver");
           dbcon = (Connection) DriverManager.getConnection ("jdbc:mysql://127.0.0.1:3306/pip","root","root");
       }
       catch (Exception e)
       {
           e.printStackTrace();
       }

    }

    String replaceDiacriticsAndUppercase(String S)
    {
        S = S.toLowerCase();

        S = S.replace(",", " ");
        S = S.replace(".", " ");

        S = S.replace("â", "a");
        S = S.replace("ă", "a");
        S = S.replace("ţ", "t");
        S = S.replace("ș", "s");
        S = S.replace("î", "i");

        return S;
    }

    void analize(String inputCV)
    {
        init();
        Scanner sc = null;
        int score[] = new int[100];
        int nrcat[] = new int[100000];
        int scorecuv[] = new int[100000];
        String content;

/*
        BufferedReader in = null;
        try {
            in = new BufferedReader(new FileReader("C:\\Users\\V  L  A  D\\Documents\\NetBeansProjects\\resumeAnalize\\cv-uri\\programare.txt"));
        } catch (FileNotFoundException ex) {
            Logger.getLogger(Analize.class.getName()).log(Level.SEVERE, null, ex);
        }

        String aux;
        content = "";
        try {
            while ((aux = in.readLine()) != null) {
                content = content + " " + aux;
            }
        } catch (IOException ex) {
            Logger.getLogger(Analize.class.getName()).log(Level.SEVERE, null, ex);
        }
*/
        content = inputCV;
        content = Jsoup.parse(content).text();
        content = content.toLowerCase();
        content = replaceDiacriticsAndUppercase(content);

        ResultSet rs = null;

        String[] res = content.split("\\s");

        for (int j=0; j<res.length; ++j)
        {
            Statement stm = null;
            try {
                stm = (Statement) dbcon.createStatement();

                if (res[j].contains("'") || res[j].contains("\"")) continue;
                rs = stm.executeQuery("SELECT * FROM keywords WHERE cuv = '" + res[j] + "'");

                while( rs.next() )
                {
                    String curCuv = rs.getString(1);
                    String curCat = rs.getString(2);
                    int curNr = rs.getInt(3);

                    Integer total = domenii.get(curCat);
                    if (total == null)
                    {
                        domenii.put(curCat, curNr+1);
                        nrDomenii.put(curCat, 1);
                    }
                    else
                    {
                        domenii.remove(curCat);
                        domenii.put(curCat, total+curNr+1);
                        total = nrDomenii.get(curCat);
                        nrDomenii.remove(curCat);
                        nrDomenii.put(curCat, total+1);
                    }
                }
                rs.close();

                stm.close();
            } catch (SQLException ex) {
                Logger.getLogger(Analize.class.getName()).log(Level.SEVERE, null, ex);
            }

            try {
                stm = (Statement) dbcon.createStatement();

                if (res[j].contains("'") || res[j].contains("\"")) continue;
                
                rs = stm.executeQuery("SELECT * FROM keymeserii WHERE cuv = '" + res[j] + "'");

                while( rs.next() )
                {
                    String curCuv = rs.getString(1);
                    String curCat = rs.getString(2);
                    int curNr = rs.getInt(3);

                    Integer total = meserii.get(curCat);
                    if (total == null)
                    {
                        meserii.put(curCat, curNr+1);
                        nrMeserii.put(curCat, 1);
                    }
                    else 
                    {
                        meserii.remove(curCat);
                        meserii.put(curCat, total+curNr+1);
                        total = nrMeserii.get(curCat);
                        nrMeserii.remove(curCat);
                        nrMeserii.put(curCat, total+1);
                    }
                }
                rs.close();

                stm.close();
            } catch (SQLException ex) {
                Logger.getLogger(Analize.class.getName()).log(Level.SEVERE, null, ex);
            }
        }


        /*
         * SORTEAZA TOATE DOMENIILE DUPA RELEVANTA
         */

        Set<String> set = domenii.keySet();
        Iterator<String> it = set.iterator();

        int count = 0;
        double scorFinal[] = new double[100000];
        String outFinal[] = new String[100000];

        int limit = 3;
        if (content.length() > 400) limit = 4;
        if (content.length() > 800) limit = 6;
        if (content.length() > 1200) limit = 8;
        if (content.length() > 1600) limit = 10;

        while (it.hasNext())
        {
            String s = it.next();
            if (domenii.get(s) <= limit) continue;
            int n = domenii.get(s);
            int k = nrDomenii.get(s);

            scorFinal[count] = ((double)n/(k*1.3) + (double)k/9);
            outFinal[count] = s;
            count ++;

            //System.out.println(s + "\t " + ((double)n/(k*1.3) + (double)k/9) + "\t " + n);
        }

        boolean ok = false;
        while (!ok)
        {
            ok = true;
            for (int j=0; j+1<count; ++j)
                if (scorFinal[j] < scorFinal[j+1])
                {
                    ok = false;

                    double scorFinalAux = scorFinal[j];
                    scorFinal[j] = scorFinal[j+1];
                    scorFinal[j+1] = scorFinalAux;

                    String outFinalAux = outFinal[j];
                    outFinal[j] = outFinal[j+1];
                    outFinal[j+1] = outFinalAux;
                }
        }

        int j = 0;
        if (j < count)
            System.out.print(outFinal[j] + " " + outFinal[j] + " " + outFinal[j]);
        ++j;
        if (j < count)
            System.out.print(outFinal[j] + " " + outFinal[j]);
        ++j;
        if (j < count)
            System.out.print(outFinal[j]);

        //System.out.println("--------------");

        /*
         * SORTEAZA TOATE MESERIILE DUPA RELEVANTA
         */

        set = meserii.keySet();
        it = set.iterator();
        count = 0;
        
        while (it.hasNext())
        {
            String s = it.next();
            if (meserii.get(s) <= limit) continue;
            int n = meserii.get(s);
            int k = nrMeserii.get(s);

            scorFinal[count] = ((double)n/(k*1.3) + (double)k/9);
            outFinal[count] = s;
            count ++;

            //System.out.println(s + "\t " + ((double)n/k*(1.3) + (double)k/9) + "\t " + n);
        }

        ok = false;
        while (!ok)
        {
            ok = true;
            for (j=0; j+1<count; ++j)
                if (scorFinal[j] < scorFinal[j+1])
                {
                    ok = false;

                    double scorFinalAux = scorFinal[j];
                    scorFinal[j] = scorFinal[j+1];
                    scorFinal[j+1] = scorFinalAux;

                    String outFinalAux = outFinal[j];
                    outFinal[j] = outFinal[j+1];
                    outFinal[j+1] = outFinalAux;
                }
        }

        j = 0;
        if (j < count)
            System.out.print(outFinal[j] + " " + outFinal[j]);
        ++j;
        if (j < count)
            System.out.print(outFinal[j]);
        
    }

}

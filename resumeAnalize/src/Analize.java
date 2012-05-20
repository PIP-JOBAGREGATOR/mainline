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
import java.util.Hashtable;
import java.util.Random;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.jsoup.Jsoup;

/**
 *
 * @author V  L  A  D
 */
public class Analize {

    Connection dbcon;

    private String domenii[] =
 {
        "Finante",
        "Inginerie",
        "Institutii",
        "IT",
        "Management",
        "Marketing",
        "Muncitori",
        "OfficeJobs",
        "Sanatate",
        "Servicii",
        "Studenti",
        "Vanzari"
    };

    private String subdomenii[] =
 {
        "Asigurari",
        "Audit",
        "Consultanta",
        "Banci",
        "Financiar",
        "Contabilitate",
        "Agricultura",
        "Automobile",
        "Cercetare",
        "Constructii",
        "Electrica",
        "Mecanica",
        "Naval",
        "Aviatie",
        "Protectia mediului",
        "Arhitectura",
        "Design",
        "Cultura",
        "Arta",
        "Educatie",
        "Fundatii",
        "Asociatii",
        "ONG",
        "Juridic",
        "Traduceri",
        "Training",
        "Electronice",
        "Internet",
        "Media",
        "Hardware",
        "Project management",
        "Software",
        "Programare",
        "Suport",
        "Telecomunicatii",
        "Vanzari",
        "Webdesign",
        "Product Management",
        "Copywriting",
        "Hostess",
        "Promoteri",
        "PR",
        "Publicitate",
        "Piscicultura",
        "Silvicultura",
        "Instalatii",
        "Amenajari",
        "Service",
        "Instalare",
        "Soferi",
        "Achizitii",
        "Administrativ",
        "Aprovizionare",
        "Logistica",
        "Resurse umane",
        "Psihologie",
        "Secretariat",
        "Chimie",
        "Biochimie",
        "Farmacii",
        "Medicina",
        "Sanatate",
        "Stomatologie",
        "Entertainment",
        "Hoteluri",
        "Intretinere",
        "Sport",
        "Paza",
        "Protectie",
        "Restaurante",
        "Transport",
        "Turism",
        "Imobiliare",
        "Retail"
    };

    void init()
    {
        try
       {

           Class.forName ("com.mysql.jdbc.Driver");
           dbcon = (Connection) DriverManager.getConnection ("jdbc:mysql://127.0.0.1:3306/pip","root","1234");
       }
       catch (Exception e)
       {
           e.printStackTrace();

       }

    }

    void analize()
    {
        init();
        Scanner sc = null;
        int score[] = new int[100];
        int nrcat[] = new int[100000];
        int scorecuv[] = new int[100000];
        BufferedReader in = null;
        try {
            in = new BufferedReader(new FileReader("C:\\Users\\V  L  A  D\\Documents\\NetBeansProjects\\resumeAnalize\\cv-uri\\asigurari.txt"));
        } catch (FileNotFoundException ex) {
            Logger.getLogger(Analize.class.getName()).log(Level.SEVERE, null, ex);
        }

        String aux;
        String content = "";
        try {
            while ((aux = in.readLine()) != null) {
                content = content + " " + aux;
            }
        } catch (IOException ex) {
            Logger.getLogger(Analize.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        content = Jsoup.parse(content).text();
        content = content.toLowerCase();

        int N = domenii.length;
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

                    for (int i=0; i<domenii.length; ++i)
                        if (curCat.equalsIgnoreCase(domenii[i]))
                        {
                            score[i] += curNr;
                            nrcat[j]++;
                            scorecuv[j] += curNr;
                        }
                    for (int i=0; i<subdomenii.length; ++i)
                        if (curCat.equalsIgnoreCase(subdomenii[i]))
                        {
                            score[N+i] += curNr;
                            nrcat[j]++;
                            scorecuv[j] += curNr;
                        }                 


                }
                rs.close();

                stm.close();
            } catch (SQLException ex) {
                Logger.getLogger(Analize.class.getName()).log(Level.SEVERE, null, ex);
            }
        }


        //get the 2 best
        int best1 = 0;
        int best2 = 0;
        int ind1 = 0;
        int ind2 = 0;
        for (int i=0; i<N; ++i)
            if (best1 < score[i])
            {
                ind2 = ind1;
                best2 = best1;
                ind1 = i;
                best1 = score[i];
            }
            else if (best2 < score[i])
            {
                ind2 = i;
                best2 = score[i];
            }

        System.out.println(ind1<N ? domenii[ind1] : subdomenii[ind1-N]);
        System.out.println(ind2<N ? domenii[ind2] : subdomenii[ind2-N]);

        for (int i=0; i<res.length; ++i)
            if (scorecuv[i] / (nrcat[i]*nrcat[i]+1) > 5) System.out.println(res[i] + " " + scorecuv[i] / (nrcat[i]*nrcat[i]+1));

    }

}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package resumeanalize;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.Driver;
import com.mysql.jdbc.Statement;
import com.sun.corba.se.spi.activation.Server;
import java.io.*;
import java.net.*;
import java.sql.*;
import javax.sql.*;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.StringTokenizer;
import java.util.logging.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jsoup.Jsoup;

/**
 *
 * @author V  L  A  D
 */
public class Ejobs {

    private static ArrayDeque<String> urlList = new ArrayDeque<String>();

    private Connection dbcon = null;
    private String listaMeserii = "";

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

        incarcaMeserii();

    }

    void incarcaMeserii()
    {
        BufferedReader in = null;

        try {
            in = new BufferedReader(new FileReader("C:\\Users\\V  L  A  D\\Documents\\NetBeansProjects\\resumeAnalize\\meserii.txt"));
        } catch (FileNotFoundException ex) {
            Logger.getLogger(Analize.class.getName()).log(Level.SEVERE, null, ex);
        }

        String aux;
        listaMeserii = "";
        try {
            while ((aux = in.readLine()) != null) {
                listaMeserii = listaMeserii + " " + aux;
            }
        } catch (IOException ex) {
            Logger.getLogger(Analize.class.getName()).log(Level.SEVERE, null, ex);
        }
        try {
            in.close();
        } catch (IOException ex) {
            Logger.getLogger(Ejobs.class.getName()).log(Level.SEVERE, null, ex);
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

    boolean checkMeserie(String S)
    {
        if (listaMeserii.indexOf(S) != -1) return true;
        return false;
    }

    void parse()
    {
        init();
    //starting adresses
        String link = "http://www.ejobs.ro/user/searchjobs?refine=&allof=&jobskeyword=&oras=&categ=&nivel_cariera=&cauta_job=Cauta+Job+%3E%3E";
        //urlList.add(link);
        for (int i=300; i<600; ++i)
            urlList.add(link + "&page=" + i);
        
        //start crawling
        while (!urlList.isEmpty())
        {
            String adress = urlList.removeFirst();

            System.out.println("Crawling " + adress);

            try
            {
                //connect to the url
                HttpURLConnection con = (HttpURLConnection) new URL(adress).openConnection();

                //get the page
                BufferedReader page = new BufferedReader(
                                new InputStreamReader(
                                con.getInputStream()));

                //parse the page
                String aux;
                String inputLine = "";
                while ((aux = page.readLine()) != null)
                    inputLine += aux;

                    //get the next page link
                /*
                System.out.println(inputLine);
                    Pattern p = Pattern.compile("(<span style=\"font-size:12px;color:#999999;font-weight:100;\">([|])</span><a href=\")([^\"]*?)\"");
                    Matcher m = p.matcher(inputLine);
                    m.find();
                    {
                        System.out.println(m.group(0));
                        String link = m.group(3);
                        System.out.println(link);
                        urlList.add(link);
                    }*/

                    Pattern p;
                    Matcher m;
                    //parse the offers
                    p = Pattern.compile("((<a class='ejorange' style='font-size:13px;font-weight:bold;' href=')|(<a class='job' style='font-size:12px;' href='))([^']*?)'");
                    m = p.matcher(inputLine);
                    while (m.find())
                    {
                        link = m.group(4);
                        m.find();

                        System.out.println(link);

                        HttpURLConnection offer = (HttpURLConnection) new URL(link).openConnection();
                        //get the page
                        BufferedReader offerpage = new BufferedReader(
                                new InputStreamReader(
                                offer.getInputStream()));

                        //parse the page
                        String content = "";
                        while ((aux = offerpage.readLine()) != null)
                            content += aux;

                        Pattern pp = Pattern.compile("<TITLE>eJobs - ([^<]*?)</TITLE>");
                        Matcher mm = pp.matcher(content);

                        //titlu
                        String curTitlu = "";
                        if (mm.find())
                            curTitlu = mm.group(1);
                        curTitlu = replaceDiacriticsAndUppercase(curTitlu);

                        String curContent = null;
                        pp = Pattern.compile("(Departament:&nbsp; </td>)([^<]*?)(<td class=\"info_company_normal\" valign=\"top\">)([^<]*?)<");
                        mm = pp.matcher(content);
                        String curDomenii = "";
                        if (mm.find())
                            curDomenii = mm.group(4);
                        //System.out.println(curDomenii);

                        curDomenii = replaceDiacriticsAndUppercase(curDomenii);
                        String[] listaDomenii = curDomenii.split("\\s");

                        //content
                        pp = Pattern.compile("<b>CANDIDATUL IDEAL:</b> </span><br><p align=\"left\"><span class=\"arial_13\" style=\"font-size:15px;line-height:23px;\">([^/]*?)/span");
                        mm = pp.matcher(content);
                        if (!mm.find()) continue;
                        curContent = mm.group(1);
                        curContent.replace("<", " ");

                        curContent = Jsoup.parse(curContent).text();
                        curContent = replaceDiacriticsAndUppercase(curContent);


                        //System.out.println(curTitlu + " " + curDomenii + " " + curContent);

                        //leaga cuvintele de domenii
                        String[] res = curContent.split("\\s");
                        for (int i=0; i<res.length; ++i)
                        {
                            for (int j=0; j<listaDomenii.length; ++j)
                                baga(res[i], listaDomenii[j]);
                        }

                        //leaga cuvintele de meserii
                        String meserii[] = curTitlu.split("\\s");
                        for (int i=0; i<res.length; ++i)
                        {
                            for (int j=0; j<meserii.length; ++j)
                                if (meserii[j].length() > 4 && listaMeserii.indexOf(meserii[j]) != -1)
                                    baga2(res[i], meserii[j]);
                        }

                        offerpage.close();
                    }


                page.close();

                //done
                System.out.println("Done");
            }
            catch(Exception e)
            {
                //System.out.println("Eroare la accesarea " + adress);
            }
        }
    }
    

    void baga(String token, String domeniu)
    {        
        if (token.contains("'")) return;
        if (token.contains("\"")) return;
        if (token.length() > 20) return;
        if (token.length() < 2 || !Character.isLetter(token.charAt(0))) return;
        try {
            Statement stm = (Statement) dbcon.createStatement();
            stm.executeUpdate("INSERT INTO new_words VALUES('" + token + "','" + domeniu + "', 0) ON DUPLICATE KEY UPDATE nr = nr+1");
            stm.close();
            //System.out.println(token + " " + domeniu);
        } catch (Exception ex) {
            Logger.getLogger(Parser.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    void baga2(String token, String domeniu)
    {
     //System.out.println(token + " " + domeniu);

        if (token.contains("'")) return;
        if (token.contains("\"")) return;
        if (token.length() > 20) return;
        if (token.length() < 2 || !Character.isLetter(token.charAt(0))) return;
        try {
            Statement stm = (Statement) dbcon.createStatement();
            stm.executeUpdate("INSERT INTO new_meserii VALUES('" + token + "','" + domeniu + "', 0) ON DUPLICATE KEY UPDATE nr = nr+1");
            stm.close();
            //System.out.println(token + " " + domeniu);
        } catch (Exception ex) {
            Logger.getLogger(Parser.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
}
